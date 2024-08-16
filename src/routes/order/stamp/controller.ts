import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class StampController extends orderController {
  addStampToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, typeId, modelId } = req.body;
      const stampOrder = new this.StampOrder({
        title: title,
        type: typeId,
        model: modelId,
      });
      const saved = await stampOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "StampOrder";
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
  getStampPrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, typeId, modelId } = req.body;
      const stampOrder = new this.StampOrder({
        title: title,
        type: typeId,
        model: modelId,
      });
      const saved = await stampOrder.save();
      const populated = await this.StampOrder.findById(saved._id).populate([
        "type",
        "model",
      ]);
      try {
        const fullPrice = await populated?.calculatePrice(number);
        await this.StampOrder.findByIdAndDelete(saved._id);
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

export default new StampController();
