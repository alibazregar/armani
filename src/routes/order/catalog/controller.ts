import BindingType from "../../../models/BindingType";
import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
class CatalogController extends orderController {
  payCatalogPrice = async (
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
        bindingTypeId,
        bindingOnPrint
      } = req.body;
      if(!req.file?.path){
        return res.status(500).send("error")
      }
      const catalogOrder = new this.CatalogOrder({
        title: title,
        size:sizeId,
        paper : {
          type : paperTypeId,
          number :paperNumber,
          color : paperColorId
        },
        cover :{
          type : coverTypeId,
         filePath : req.file?.path,
        },
        binding : bindingTypeId ,
        onPrint : bindingOnPrint
      })
      const saved = await catalogOrder.save();
      req.savedOrder = saved;
      req.orderType = "CatalogOrder";
      req.price = await catalogOrder.calculatePrice(number);
      next();
    } catch (error) {
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
}

export default new CatalogController();
