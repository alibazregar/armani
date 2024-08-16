import { Request } from "express";
import { Model, Document, ObjectId } from "mongoose";
import { IUser } from "../models/user";
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
    savedOrder?: string;
    user?: IUserDocument;
    files?: MulterFile[];
    orderType:
      | "BookOrder"
      | "BrochureOrder"
      | "CatalogOrder"
      | "BannerOrder"
      | "PackageOrder"
      | "FlagOrder"
      | "OfficeSet"
      | "MugOrder"
      | "TShirtOrder"
      | "NoteBookOrder"
      | "CardOrder"
      | "FoamBoardOrder"
      | "StampOrder" | "PhotoChassis"|"PopUpStand" | "Box" |"Label" | "StandXOrder";
  }
}
