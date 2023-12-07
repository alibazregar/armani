import { RequestHandler, Request, Response } from "express";
import { validationResult } from "express-validator";
import autoBind from "auto-bind";
import User, { IUser } from "../model/user";
import { Model } from "mongoose";
import kavenegar from "kavenegar";
import { redisClient } from "../db/redisConnect";
const secret = process.env.OTP_SECRET ?? "secret_key";
import { totp } from "otplib";

totp.options = { digits: 6, step: 300 };
const api = kavenegar.KavenegarApi({
  apikey: process.env.SMS_KEY ?? "",
});
export default abstract class Controller {
  User: Model<IUser>;
  constructor() {
    autoBind(this);
    this.User = User;
  }
  validationBody(req: Request, res: Response): boolean {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const messages: string[] = [];
      errors.forEach((err) => messages.push(err.msg));
      res.status(400).json({
        message: messages,
        result: null,
      });
      return false;
    }
    return true;
  }
  validate: RequestHandler = (req, res, next) => {
    if (!this.validationBody(req, res)) {
      return;
    }
    next();
  };
  sendCode(token: string, receptor: string) {
    return new Promise((resolve, reject) => {
      api.VerifyLookup(
        {
          token: token,
          //@ts-ignore
          sender: "10000300009900",
          receptor: receptor,
          template: "enterYourTemplateName",
        },
        function (response, status) {
          if (status !== 200) {
            reject(new Error("invalid status code: " + response[0]?.messageid));
          } else {
            resolve(status);
          }
        }
      );
    });
  }
  async generateAndStoreAndSendOTP(phone: number): Promise<string> {
    const otp = totp.generate(secret);
    await redisClient.set(phone.toString(), otp);
    await redisClient.expire(phone.toString(), 300);
    await this.sendCode(phone.toString(), otp);
    console.log(otp)
    return otp;
  }
  // Verify OTP
  async verifyOTP(phone: number, userEnteredOTP: string): Promise<boolean> {
    const storedOTP = await redisClient.get(phone.toString());
    if (!storedOTP) return false;
    return totp.check(userEnteredOTP, secret) && userEnteredOTP === storedOTP;
  }
}
