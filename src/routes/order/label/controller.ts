import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class LabelController extends orderController {
  addLabelToCart = async (
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
      const Label = new this.Label({
        title: title,
        onPrint: onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type: type,
      });
      const saved = await Label.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "Label";
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
  getLabelPrice: RequestHandler = async (req, res) => {
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
      const Label = new this.Label({
        title: title,
        onPrint: onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type: type,
      });
      const saved = await Label.save();
      const savedWithPopulate = await this.Label.findById(saved._id).populate([
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

export default new LabelController();
