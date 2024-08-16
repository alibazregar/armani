import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class BoxController extends orderController {
  addBoxToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {
        number,
        title,
        onPrintId,
        sizeId,
        afterPrintServices,
        type,
        materialId,
      } = req.body;
      const Box = new this.Box({
        title: title,
        onPrint: onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type: type,
      });
      const saved = await Box.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "Box";
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
  getBoxPrice: RequestHandler = async (req, res) => {
    try {
      const {
        number,
        title,
        onPrintId,
        sizeId,
        afterPrintServices,
        type,
        materialId,
      } = req.body;
      const Box = new this.Box({
        title: title,
        onPrint: onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type: type,
      });
      const saved = await Box.save();
      const savedWithPopulate = await this.Box.findById(saved._id).populate([
        "material",
        "onPrint",
        "size",
      ]);
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

export default new BoxController();
