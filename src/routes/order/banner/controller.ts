import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class BannerController extends orderController {
  addBannerToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, standId, sizeId, afterPrintServices } = req.body;
      const bannerOrder = new this.BannerOrder({
        title: title,
        stand: standId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      const saved = await bannerOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "BannerOrder";
      next();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
  getBannerPrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, standId, sizeId, afterPrintServices } = req.body;
      const bannerOrder = new this.BannerOrder({
        title: title,
        stand: standId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      const saved =await bannerOrder.save()
      const savedWithPopulate = await this.BannerOrder.findById(saved._id).populate(["size","stand"])
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number)
        await this.BannerOrder.findByIdAndDelete(saved._id)
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

export default new BannerController();
