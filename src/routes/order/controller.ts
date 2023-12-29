import Controller from "../controller";
import { Response } from "express";
import { getConfigValueByKey } from "../../models/config";
import axios from "axios";
import { RequestHandler } from "express-serve-static-core";
export default class orderController extends Controller {
  createOrderAndPayment = async (
    req: CustomRequest,
    res: Response
  ): Promise<void | Response> => {
    const { postCode, address, number,description } = req.body;
    const postPrice = await getConfigValueByKey("postPrice");
    if (!req.price || !req.savedOrder || !req.files || !req.orderType) {
      return res.status(500).json({ message: "invalid argument;server error" });
    }
    const params = {
      merchant_id: process.env.MERCHANT_ID,
      amount: req.price + postPrice,
      callback_url: process.env.BASE_URL + "/api/v1/order/pay-callback",
      description: "payment",
    };
    const response = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      params
    );
    if (response.data.data.code == 100) {
      const newOrder = new this.Order({
        user: req.user?._id,
        type: req.savedOrder?._id,
        itemType: req.orderType,
        media:
          req.files?.map((file) => {
            return file.path;
          }) ?? [],
        number: number,
        address: address,
        postCode: postCode,
        totalPrice: req.price,
        postPrice: postPrice,
        res_number: response.data.data.authority,
        description
      });
      await newOrder.save();
      return res.status(200).json({
        message: null,
        result: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
      });
    } else {
      return res.status(400).render("error");
    }
  };
  payCallBack: RequestHandler = async (req, res) => {
    try {
      // TODO:: implement payment call back API and save the transaction to database
      if (req.query.Status && req.query.Status !== "OK") {
        return res
          .status(400)
          .json({ message: "payment failed", result: null });
      }
      console.log(req.query.status, req.query.Authority);
      let order = await this.Order.findOne({
        resNumber: req.query.Authority,
      });
      if (!order) {
        return res
          .status(400)
          .json({ message: "invalid payment", result: null });
      }
      let params = {
        merchant_id: process.env.MERCHANT_ID,
        amount: order.totalPrice + order.postPrice,
        authority: req.query.Authority,
      };
      const response = await axios.post(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        params
      );
      if (response.data.data.code == 100) {
        return res.status(200).render("success", { code: order.res_number });
      } else {
        return res.status(400).render("error");
      }
    } catch (error) {
      console.log(`paymentCallbackErr : ${error}`);
      return res
        .status(500)
        .json({ message: "متاسفانه ارتباط برقرار نگردید", result: null });
    }
  };
}
