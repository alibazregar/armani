import { Request } from "express";
import { Model, Document } from "mongoose";
import { IBookOrder } from "../models/bookOrder";
import { IOtherOrder } from "../models/otherOrders";
import { IUser } from "../models/user";
import { IBrochureOrder } from "../models/brochureOrder";
import { ICatalogOrder } from "../models/catalogOrder";
interface IBookDocument extends IBookOrder, Document {}
interface IOtherDocument extends IOtherOrder, Document {}
interface IUserDocument extends IUser, Document {}
interface IBrochureDocument extends IBrochureOrder, Document {}
interface ICatalogDocument extends ICatalogOrder, Document {}
declare global {
  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }
  interface CustomRequest extends Request {
    savedOrder?: IBookDocument | IBrochureDocument |ICatalogDocument |IOtherDocument;
    user?: IUserDocument;
    files?: MulterFile[];
    orderType: "BookOrder" | "BrochureOrder"|"CatalogOrder" | "OtherOrder";
    price?: number;
  }
}
