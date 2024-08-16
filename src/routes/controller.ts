import { RequestHandler, Request, Response } from "express";
import { validationResult } from "express-validator";
import BannerOrder, { IBannerOrder } from "../models/bannerOrder";
import CardOrder, { ICardOrder } from "../models/cardOrder";
import autoBind from "auto-bind";
import PhotoChassis, { IPhotoChassis } from "../models/photoChassis";
import User, { IUser } from "../models/user";
import BookOrder, { IBookOrder } from "../models/bookOrder";
import BrochureOrder, { IBrochureOrder } from "../models/brochureOrder";
import CatalogOrder, { ICatalogOrder } from "../models/catalogOrder";
import PackageOrder, { IPackageOrder } from "../models/packageOrder";
import FlagOrder, { IFlagOrder } from "../models/flagOrder";
import OfficeSet, { IOfficeSet } from "../models/officeSet";
import MugOrder, { IMugOrder } from "../models/mugOrder";
import NoteBookOrder, { INoteBookOrder } from "../models/noteBook";
import StampOrder, { IStampOrder } from "../models/stampOrder";
import Order, { IOrder } from "../models/order";
import { Model } from "mongoose";
import kavenegar from "kavenegar";
import { redisClient } from "../db/redisConnect";
const secret = process.env.OTP_SECRET ?? "secret_key";
import { totp } from "otplib";
import TShirtOrder, { ITShirtOrder } from "../models/tShirtOrder";
import Cart, { ICart } from "../models/cart";
import PopUpStand, { IPopUpStand } from "../models/popUpStand";
import Box, { IBox } from "../models/box";
import Label, { ILabel } from "../models/label";
import StandXOrder, { IStandXOrder } from "../models/standX";
import FoamBoardOrder, { IFoamBoardOrder } from "../models/foamBoard";

totp.options = { digits: 6, step: 300 };
const api = kavenegar.KavenegarApi({
  apikey: process.env.SMS_KEY ?? "",
});
export default abstract class Controller {
  Cart: Model<ICart>;
  User: Model<IUser>;
  BookOrder: Model<IBookOrder>;
  Order: Model<IOrder>;
  BrochureOrder: Model<IBrochureOrder>;
  CatalogOrder = Model<ICatalogOrder>;
  PackageOrder: Model<IPackageOrder>;
  FlagOrder: Model<IFlagOrder>;
  OfficeSet: Model<IOfficeSet>;
  MugOrder: Model<IMugOrder>;
  TShirtOrder: Model<ITShirtOrder>;
  NoteBookOrder: Model<INoteBookOrder>;
  StampOrder: Model<IStampOrder>;
  BannerOrder: Model<IBannerOrder>;
  CardOrder: Model<ICardOrder>;
  PhotoChassis: Model<IPhotoChassis>;
  PopUpStand: Model<IPopUpStand>;
  Box: Model<IBox>;
  Label: Model<ILabel>;
  FoamBoardOrder: Model<IFoamBoardOrder>;
  StandXOrder: Model<IStandXOrder>;
  constructor() {
    autoBind(this);
    this.User = User;
    this.BookOrder = BookOrder;
    this.Order = Order;
    this.BrochureOrder = BrochureOrder;
    this.CatalogOrder = CatalogOrder;
    this.PackageOrder = PackageOrder;
    this.FlagOrder = FlagOrder;
    this.OfficeSet = OfficeSet;
    this.MugOrder = MugOrder;
    this.TShirtOrder = TShirtOrder;
    this.NoteBookOrder = NoteBookOrder;
    this.StampOrder = StampOrder;
    this.Cart = Cart;
    this.BannerOrder = BannerOrder;
    this.CardOrder = CardOrder;
    this.PhotoChassis = PhotoChassis;
    this.PopUpStand = PopUpStand;
    this.Box = Box;
    this.Label = Label;
    this.FoamBoardOrder = FoamBoardOrder;
    this.StandXOrder = StandXOrder;
  }
  protected validationBody(req: Request, res: Response): boolean {
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
  protected validate: RequestHandler = (req, res, next) => {
    if (!this.validationBody(req, res)) {
      return;
    }
    next();
  };
  protected sendCode(token: string, receptor: string) {
    return new Promise((resolve, reject) => {
      api.VerifyLookup(
        {
          token: token,
          //@ts-ignore
          sender: "10008663",
          receptor: receptor,
          template: "armani",
        },
        function (response, status) {
          if (status !== 200) {
            reject(new Error("invalid status code: " + response));
          } else {
            resolve(status);
          }
        }
      );
    });
  }
  protected sendMessage( receptor: string,status : string) : Promise<any> {
    return new Promise((resolve, reject) => {
      let statusFa = status == "preparing"? "در حال آماده سازی": status == "sent" ?"ارسال شده":status ==  "sending" ?"در حال ارسال" :status ==  "rejected" ? "لغو شده"  : ""
      api.Send(
        {
          message : `وضعیت سفارش شما به ` + statusFa + "تغییر کرد",
          //@ts-ignore
          sender: "2000500666",
          receptor: receptor,
        },
        function (response, status) {
          if (status !== 200) {
            reject(new Error("invalid status code: " + response));
          } else {
            resolve(status);
          }
        }
      );
    });
  }
  protected async generateAndStoreAndSendOTP(phone: number): Promise<string> {
    const otp = totp.generate(secret);
    await redisClient.set(phone.toString(), otp);
    await redisClient.expire(phone.toString(), 300);
    console.log(otp);
    await this.sendCode(otp, phone.toString());
    return otp;
  }
  // Verify OTP
  protected async verifyOTP(
    phone: number,
    userEnteredOTP: string
  ): Promise<boolean> {
    const storedOTP = await redisClient.get(phone.toString());
    if (!storedOTP) return false;
    return totp.check(userEnteredOTP, secret) && userEnteredOTP === storedOTP;
  }
}
