import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class TShirtController extends orderController {
  addTShirtToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {title, color, sizeId, materialId } = req.body;
      const tShirtOrder = new this.TShirtOrder({
        title: title,
        color: color,
        size: sizeId,
        material: materialId,
      });
      const saved = await tShirtOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "TShirtOrder";
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
  getTShirtPrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, color, sizeId,materialId } = req.body;
      const tShirtOrder = new this.TShirtOrder({
        title: title,
        color: color,
        size: sizeId,
        material : materialId
      });
      const saved =await tShirtOrder.save()
      const savedWithPopulate = await this.TShirtOrder.findById(saved._id).populate(["size","material"])
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number)
        await this.TShirtOrder.findByIdAndDelete(saved._id)
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

export default new TShirtController();
