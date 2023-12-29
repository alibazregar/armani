import BindingType from "../../../models/BindingType";
import CoverType from "../../../models/coverType";
import PaperColor from "../../../models/paper/paperColor";
import PaperType from "../../../models/paper/paperType";
import Size from "../../../models/size";
import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
class BookController extends orderController {
  payBookPrice = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const {
        number,
        title,
        sizeId,
        paperTypeId,
        paperColorId,
        paperNumber,
        coverTypeId,
        bindingFacesId,
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
          binding: BindingType,
          bindingFaces: bindingFacesId,
          filePath: req.file?.path,
        },
      });
      const saved = await bookOrder.save();
      req.savedOrder = saved;
      req.orderType = "BookOrder";
      req.price = await bookOrder.calculatePrice(number);
      next();
    } catch (error) {
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
        bindingFacesId,
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
          binding: BindingType,
          bindingFaces: bindingFacesId,
        },
      });
      try {
        const fullPrice = bookOrder.calculatePrice(number);
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

  getBindingTypes: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await BindingType.findById(id);
      return res.status(200).json({ result });
    }
    const results = await BindingType.find({});
    return res.status(200).json({ results: results });
  };
  getCoverTypes: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await CoverType.findById(id);
      return res.status(200).json({ result });
    }
    const results = await CoverType.find({});
    return res.status(200).json({ results: results });
  };
  getPaperTypes: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await PaperType.findById(id);
      return res.status(200).json({ result });
    }
    const results = await PaperType.find({});
    return res.status(200).json({ results: results });
  };
  getPaperColors: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await PaperColor.findById(id);
      return res.status(200).json({ result });
    }
    const results = await PaperColor.find({});
    return res.status(200).json({ results: results });
  };

  getSize: RequestHandler = async (req, res) => {
    const id = req.query.id;
    if (id) {
      const result = await Size.findById(id);
      return res.status(200).json({ result });
    }
    const results = await Size.find({});
    return res.status(200).json({ results: results });
  };
}

export default new BookController();
