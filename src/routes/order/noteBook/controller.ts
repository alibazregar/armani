import orderController from "../controller";
import { RequestHandler } from "express";
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
class NoteBookController extends orderController {
  payNoteBookPrice = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { title, coverTypeId, afterPrintServices ,pageNumber,size} = req.body;
      const noteBookOrder = new this.NoteBookOrder({
        size : size,
        title: title,
        coverType: coverTypeId,
        afterPrintServices: afterPrintServices,
        pageNumber: pageNumber,
      });
      const saved = await noteBookOrder.save();
      req.savedOrder = saved._id.toString();
      req.orderType = "NoteBookOrder";
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
  getNoteBookPrice: RequestHandler = async (req, res) => {
    try {
      const { number, title, coverTypeId, afterPrintServices ,pageNumber,size} = req.body;
      const noteBookOrder = new this.NoteBookOrder({
        title: title,
        coverType: coverTypeId,
        afterPrintServices: afterPrintServices,
        pageNumber: pageNumber,
        size: size
      });
      const saved =await noteBookOrder.save()
      const savedWithPopulate = await this.NoteBookOrder.findById(saved._id).populate("coverType")
      try {
        const fullPrice = await savedWithPopulate?.calculatePrice(number)
        await this.NoteBookOrder.findByIdAndDelete(saved._id)
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

export default new NoteBookController();
