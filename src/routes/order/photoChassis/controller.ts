import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class PhotoChassisController extends orderController {
  addPhotoChassisToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {number, title, coverTypeId, sizeId, afterPrintServices,type ,materialId} = req.body;
      const photoChassis = new this.PhotoChassis({
        title: title,
        coverType : coverTypeId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type : type
      });
      const saved = await photoChassis.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "PhotoChassis";
      next();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.log(`authSendCodeErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
  getPhotoChassisPrice: RequestHandler = async (req, res) => {
    try {
      const {number, title, coverTypeId, sizeId, afterPrintServices,type ,materialId} = req.body;
      const photoChassis = new this.PhotoChassis({
        title: title,
        coverType : coverTypeId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type : type
      });
      const saved = await photoChassis.save();
      const savedWithPopulate = await this.PhotoChassis.findById(
        saved._id
      ).populate(["material", "coverType", "size"]);
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number);
        return res.status(200).json({ price: fullPrice });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.log(`getBookPriceErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
}

export default new PhotoChassisController();
