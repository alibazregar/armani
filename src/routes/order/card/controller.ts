import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class CardController extends orderController {
  addCardToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, onPrintId, sizeId, afterPrintServices,type ,materialId} = req.body;
      const cardOrder = new this.CardOrder({
        title: title,
        onPrint : onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type : type
      });
      const saved = await cardOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "CardOrder";
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
  getCardPrice: RequestHandler = async (req, res) => {
    try {
      const {number, title, onPrintId, sizeId, afterPrintServices,type ,materialId} = req.body;
      const cardOrder = new this.CardOrder({
        title: title,
        onPrint : onPrintId,
        material: materialId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
        type : type
      });
      const saved = await cardOrder.save();
      const savedWithPopulate = await this.CardOrder.findById(
        saved._id
      ).populate(["material", "onPrint", "size"]);
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

export default new CardController();
