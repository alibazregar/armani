import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class StandXController extends orderController {
  addStandXToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, modelId, coverTypeId, number } = req.body;
      const order = new this.StandXOrder({
        title: title,
        model: modelId,
        coverType: coverTypeId,
      });
      const saved = await order.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "StandXOrder";
      next();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.log(`authSendCodeErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: error,
      });
    }
  };
  getStandXPrice: RequestHandler = async (req, res) => {
    try {
      const { title, modelId, coverTypeId, number } = req.body;
      const order = new this.StandXOrder({
        title: title,
        model: modelId,
        coverType: coverTypeId,
      });
      const saved = await order.save();
      const populated = await this.StandXOrder.findById(saved._id).populate([
        "model",
        "coverType",
      ]);
      try {
        const fullPrice = await populated?.calculatePrice(number);
        await this.StandXOrder.findByIdAndDelete(saved._id);
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

export default new StandXController();
