import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import { IOfficeSetsPaperType } from "../../../models/officeSet";
import mongoose from "mongoose";
class OfficeSetController extends orderController {
  addOfficeSetToCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      req.body.number = req.body.number ? req.body.number : 1
      const { a4, a5, title } = JSON.parse(req.body.content) as {
        a4: IOfficeSetsPaperType<"a4">;
        a5: IOfficeSetsPaperType<"a5">;
        title : string
        number: number;
      };
      const schemaInput: IOfficeSetsPaperType<"a4" | "a5">[] = [];
      if (a4) {
        a4.type = "a4"
        schemaInput.push(a4);
      }
      if (a5) {
        a5.type = "a5"
        schemaInput.push(a5);
      }
      console.log(title)
      const officeSet = new this.OfficeSet({
        title : title,
        //@ts-ignore
        cover : process.env.BASE_URL + req.files?.cover[0].path,
        paperTypes: schemaInput,
      });
      const saved = await officeSet.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "OfficeSet";
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
  getOfficeSetPrice: RequestHandler = async (req, res) => {
    try {
      const { a4, a5, number } = req.body as {
        a4: IOfficeSetsPaperType<"a4">;
        a5: IOfficeSetsPaperType<"a5">;
        number: number;
      };
      const schemaInput: IOfficeSetsPaperType<"a4" | "a5">[] = [];
      if (a4) {
        schemaInput.push(a4);
      }
      if (a5) {
        schemaInput.push(a5);
      }
      const officeSet = new this.OfficeSet({
        title : req.body.title,
        paperTypes: schemaInput,
      });
      const saved = await officeSet.save();
      const savedWithPopulate = await this.OfficeSet.findById(
        saved._id
      ).populate([
        "paperTypes.header.onPrint",
        "paperTypes.pocket.onPrint",
        "paperTypes.header.material",
        "paperTypes.pocket.material",
      ]);
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number);
        await this.OfficeSet.findByIdAndDelete(saved._id)
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

export default new OfficeSetController();
