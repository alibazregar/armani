import BindingType from "../../../models/attributes/BindingType";
import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class CatalogController extends orderController {
  addCatalogToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {
        title,
        sizeId,
        paperTypeId,
        paperColorId,
        paperNumber,
        coverTypeId,
        bindingTypeId,
        onPrintId,
        bindingFaces,
        coverColor,
      } = req.body;
      const catalogOrder = new this.CatalogOrder({
        title: title,
        size: sizeId,
        paper: {
          type: paperTypeId,
          number: paperNumber,
          color: paperColorId,
        },
        cover: {
          color: coverColor,
          type: coverTypeId,
          bindingFaces: bindingFaces,
          //@ts-ignore
          filePath : process.env.BASE_URL + req.files?.cover[0].path,
        },
        binding: bindingTypeId,
        onPrint: onPrintId,
      });
      const saved = await catalogOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "CatalogOrder";
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
  getCatalogPrice: RequestHandler = async (req, res) => {
    try {
      const {
        number,
        title,
        sizeId,
        paperTypeId,
        paperColorId,
        paperNumber,
        coverTypeId,
        onPrintId,
        bindingTypeId,
        coverColor,
        bindingFaces,
      } = req.body;
      const catalogOrder = new this.CatalogOrder({
        title: title,
        size: sizeId,
        paper: {
          type: paperTypeId,
          number: paperNumber,
          color: paperColorId,
        },
        binding: bindingTypeId,
        cover: {
          type: coverTypeId,
          color: coverColor,
          bindingFaces: bindingFaces,
        },
        onPrint: onPrintId,
      });
      const saved = await catalogOrder.save();
      const savedWithPopulate = await this.CatalogOrder.findById(
        saved._id
      ).populate([
        "onPrint",
        "size",
        "paper.type",
        "paper.color",
        "binding",
        "cover.type",
      ]);
      if (!savedWithPopulate?.calculatePrice) {
        throw new Error("problem");
      }
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number);
        await this.CatalogOrder.findByIdAndDelete(saved._id);
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

export default new CatalogController();
