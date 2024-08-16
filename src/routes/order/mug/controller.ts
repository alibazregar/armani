import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class MugController extends orderController {
  addMugToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, typeId, afterPrintServices } = req.body;
      const mugOrder = new this.MugOrder({
        title: title,
        type: typeId,
        afterPrintServices: afterPrintServices,
      });
      const saved = await mugOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "MugOrder";
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
  getMugPrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, typeId, afterPrintServices } = req.body;
      const mugOrder = new this.MugOrder({
        title: title,
        type: typeId,
        afterPrintServices: afterPrintServices,
      });
      const saved =await mugOrder.save()
      const savedWithPopulate = await this.MugOrder.findById(saved._id).populate("type")
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number)
        await this.MugOrder.findByIdAndDelete(saved._id)
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

export default new MugController();
