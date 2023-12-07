import Controller from "../controller";
import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

class UserController extends Controller {
  authSendCode: RequestHandler = async (req, res) => {
    try {
      const { phone } = req.body;
      let existedUser = await this.User.findOne({ phone });
      if (!existedUser) {
      }
      const newUser = new this.User({
        phone,
      });
      await newUser.save();
      await this.generateAndStoreAndSendOTP(phone);
      return res.status(200).json({
        message: "the code is sent!",
        result: phone,
      });
    } catch (error) {
      console.log(`authSendCodeErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };

  auth: RequestHandler = async (req, res) => {
    try {
      const { phone, code } = req.body;

      if (!phone)
        return res.status(400).json({
          message: "enter your phone",
          result: null,
        });

      const user = await this.User.findOne({ phone });
      if (!user) {
        return res.status(400).json({ message: "invalid phone" });
      }
      if (user.loginAttempts >= 5) {
        const currentTime = new Date();
        const lastAttemptTime = user.lastLoginAttempt;

        if (
          lastAttemptTime &&
          currentTime.getTime() - lastAttemptTime.getTime() < 60000
        ) {
          // 60000 milliseconds = 1 minute
          return res.status(403).json({
            error: "too many login attempts ; try again one min later",
          });
        }

        // Reset login attempts if the time limit has passed
        user.loginAttempts = 0;
        user.lastLoginAttempt = null;
        user.save();
      }
      if (!(await this.verifyOTP(phone, code))) {
        user.loginAttempts += 1;
        user.lastLoginAttempt = new Date();
        user.save();
        return res.status(400).json({
          message: "the entered otp code is wrong",
          result: null,
        });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.AUTH_CODE ?? "default",
        {
          expiresIn: "30d",
        }
      );
      user.loginAttempts = 0;
      user.lastLoginAttempt = new Date();
      user.save();
      await user.save();

      return res.status(201).json({
        message: "login was successful!",
        result: token,
      });
    } catch (error) {
      console.log(`authErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };

  resendCode: RequestHandler = async (req, res) => {
    try {
      const { phoneStr } = req.params;
      let phone = Number(phoneStr);
      if (phoneStr.length !== 11) {
        return res.status(400).json({
          message: "شماره اشتباه است",
          result: null,
        });
      }

      const user = await this.User.findOne({ phone });

      if (!user) {
        return res.status(400).json({
          message: "user not found",
          result: null,
        });
      }
      await this.generateAndStoreAndSendOTP(phone);
      return res.status(200).json({
        message: "کد دوباره ارسال شد",
        result: null,
      });
    } catch (error) {
      console.log(`authErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
}

export default new UserController();
