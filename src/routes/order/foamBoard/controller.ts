import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class FoamBoardController extends orderController {
  addFoamBoardToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, materialId, sizeId, number } = req.body;
      const order = new this.FoamBoardOrder({
        title: title,
        size: sizeId,
        material: materialId,
      });
      const saved = await order.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "FoamBoardOrder";
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
  getFoamBoardPrice: RequestHandler = async (req, res) => {
    try {
      const { title, materialId, sizeId, number } = req.body;
      const order = new this.FoamBoardOrder({
        title: title,
        size: sizeId,
        material: materialId,
      });
      const saved = await order.save();
      const populated = await this.FoamBoardOrder.findById(saved._id).populate([
        "material",
        "size",
      ]);
      try {
        const fullPrice = await populated?.calculatePrice(number);
        await this.FoamBoardOrder.findByIdAndDelete(saved._id);
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

export default new FoamBoardController();
