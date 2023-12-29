import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import BrochureMaterial from "../../../models/brochureAttr/brochureMaterial";
import BrochureOnPrint from "../../../models/brochureAttr/brochureOnPrint";
class BrochureController extends orderController {
  payBrochurePrice = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {
        number,
        title,
        materialId,
        onPaperId,
        sizeId,
        afterPrintServices,
      } = req.body;
      const brochureOrder = new this.BrochureOrder({
        title: title,
        material: materialId,
        onPrint: onPaperId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      const saved = await brochureOrder.save();
      req.savedOrder = saved;
      req.orderType = "BrochureOrder";
      req.price = await brochureOrder.calculatePrice(number);
      next();
    } catch (error) {
      console.log(`authSendCodeErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
  getBrochurePrice: RequestHandler = async (req, res) => {
    try {
      const {
        number,
        title,
        materialId,
        onPaperId,
        sizeId,
        afterPrintServices,
      } = req.body;
      const brochureOrder = new this.BrochureOrder({
        title: title,
        material: materialId,
        onPrint: onPaperId,
        size: sizeId,
        afterPrintServices: afterPrintServices,
      });
      try {
        const fullPrice = brochureOrder.calculatePrice(number);
        return res.status(200).json({ price: fullPrice });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    } catch (error) {
      console.log(`getBookPriceErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
  getBrochureMaterials: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await BrochureMaterial.findById(id);
      return res.status(200).json({ result });
    }
    const results = await BrochureMaterial.find({});
    return res.status(200).json({ results: results });
  };
  getBrochureOnPrints: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await BrochureOnPrint.findById(id);
      return res.status(200).json({ result });
    }
    const results = await BrochureOnPrint.find({});
    return res.status(200).json({ results: results });
  };
}

export default new BrochureController();
