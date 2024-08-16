import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class FlagController extends orderController {
  addFlagToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {standId, title, onPaperId,  afterPrintServices,materialId ,typeId} = req.body;
      const flagOrder = new this.FlagOrder({
        title: title,
        onPrint: onPaperId,
        material : materialId,
        afterPrintServices: afterPrintServices,
        stand : standId,
        type : typeId
      });
      const saved = await flagOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "FlagOrder";
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
  getFlagPrice: RequestHandler = async (req, res) => {
    try {
      const { title,standId, afterPrintServices,materialId,number  ,typeId} = req.body;
      const flagOrder = new this.FlagOrder({
        title: title,
        stand : standId,
        material : materialId,
        afterPrintServices: afterPrintServices,
        type : typeId,
      });
      const saved = await flagOrder.save()
      const populated = await this.FlagOrder.findById(saved._id).populate(["material","stand","type"]);
      try {
        const fullPrice = await populated?.calculatePrice(number)
        await this.FlagOrder.findByIdAndDelete(saved._id)
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

export default new FlagController();
