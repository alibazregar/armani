import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class PackageController extends orderController {
  addPackageToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {title, onPaperId, sizeId, afterPrintServices } = req.body;
      const packageOrder = new this.PackageOrder({
        title: title,
        onPrint: onPaperId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      const saved = await packageOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "PackageOrder";
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
  getPackagePrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, onPaperId, sizeId, afterPrintServices } = req.body;
      const packageOrder = new this.PackageOrder({
        title: title,
        onPrint: onPaperId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      try {
        const fullPrice = packageOrder.calculatePrice ? packageOrder.calculatePrice(number):"";
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

export default new PackageController();
