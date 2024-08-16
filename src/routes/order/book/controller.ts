import BindingType from "../../../models/attributes/BindingType";
import CoverType from "../../../models/attributes/coverType";
import PaperColor from "../../../models/attributes/paper/paperColor";
import PaperType from "../../../models/attributes/paper/paperType";
import Size from "../../../models/attributes/size";
import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class BookController extends orderController {
  payBookPrice = async (
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
        bindingFaces,
        bindingTypeId,
        coverPaperId,
        bindingWay,
        bindingLanguage,
        description
      } = req.body;
      const bookOrder = new this.BookOrder({
        title: title,
        size: sizeId,
        paper: {
          type: paperTypeId,
          number: paperNumber,
          color: paperColorId,
        },
        cover: {
          type: coverTypeId,
          binding: bindingTypeId,
          bindingFaces: bindingFaces,
          paper: coverPaperId,
          bindingLanguage: bindingLanguage,
          bindingWay: bindingWay,
          //@ts-ignore
          filePath : process.env.BASE_URL + req.files?.cover[0].path,
          description 
        },
      });
      const saved = await bookOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "BookOrder";
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
  getBookPrice: RequestHandler = async (req, res) => {
     try {
      const {
        number,
        title,
        sizeId,
        paperTypeId,
        paperColorId,
        paperNumber,
        coverTypeId,
        bindingFaces,
        bindingTypeId,
        coverPaperId,
        bindingWay,
        bindingLanguage,
      } = req.body;
      const bookOrder = new this.BookOrder({
        title: title,
        size: sizeId,
        paper: {
          type: paperTypeId,
          number: paperNumber,
          color: paperColorId,
        },
        cover: {
          type: coverTypeId,
          binding: bindingTypeId,
          bindingFaces: bindingFaces,
          paper: coverPaperId,
          bindingLanguage: bindingLanguage,
          bindingWay: bindingWay,
        },
      });
      const saved = await bookOrder.save();
      const savedWithPopulate = await this.BookOrder.findById(
        saved._id
      ).populate([
        "paper.type",
        "paper.color",
        "cover.type",
        "cover.binding",
        "size",
        "cover.paper",
      ]);
      console.log(savedWithPopulate)
      if (!savedWithPopulate?.calculatePrice) {
        throw new Error("problem");
      }
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number);
        await this.BookOrder.findByIdAndDelete(saved._id);
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

  getBindingTypes: RequestHandler = async (req, res) => {
    const { id, type } = req.query;
    if (id) {
      const result = await BindingType.findById(id);
      return res.status(200).json({ result });
    } else if (type) {
      const results = await BindingType.find({ type: type });
      return res.status(200).json({ results: results });
    }
    const results = await BindingType.find({});
    return res.status(200).json({ results: results });
  };
  getCoverTypes: RequestHandler = async (req, res) => {
    const { id, type } = req.query;
    if (id) {
      const result = await CoverType.findById(id);
      return res.status(200).json({ result });
    } else if (type) {
      const results = await CoverType.find({ type: type });
      return res.status(200).json({ results: results });
    }
    const results = await CoverType.find({});
    return res.status(200).json({ results: results });
  };
  getPaperTypes: RequestHandler = async (req, res) => {
    const { id, type } = req.query;
    if (id) {
      const result = await PaperType.findById(id);
      return res.status(200).json({ result });
    } else if (type) {
      const results = await PaperType.find({ type: type });
      return res.status(200).json({ results: results });
    }
    const results = await PaperType.find({});
    return res.status(200).json({ results: results });
  };
  getPaperColors: RequestHandler = async (req, res) => {
    const { id, type } = req.query;
    if (id) {
      const result = await PaperColor.findById(id);
      return res.status(200).json({ result });
    } else if (type) {
      const results = await PaperColor.find({ type: type });
      return res.status(200).json({ results: results });
    }
    const results = await PaperColor.find({});
    return res.status(200).json({ results: results });
  };

  getSize: RequestHandler = async (req, res) => {
    const { id, type } = req.query;
    if (id) {
      const result = await Size.findById(id);
      return res.status(200).json({ result });
    } else if (type) {
      const results = await Size.find({ type: type });
      return res.status(200).json({ results: results });
    }
    const results = await Size.find({});
    return res.status(200).json({ results: results });
  };
}

export default new BookController();
