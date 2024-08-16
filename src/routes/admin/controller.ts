import Controller from "../controller";
import { RequestHandler, Request, Response } from "express";
import Config, { setConfigValueByKey } from "../../models/config";
import { IOrder } from "./../../models/order";
import mongoose from "mongoose";
import { IUser } from "../../models/user";
import { toGregorian } from "jalaali-js";
import moment from "moment";
import "moment-jalali";
interface TimeRange {
  start: Date;
  end: Date;
}
const getTodayRange = (): TimeRange => {
  const start = moment().startOf("day").toDate();
  const end = moment().endOf("day").toDate();
  return { start, end };
};
const getWeekRange = (): TimeRange => {
  const start = moment().startOf("week").toDate();
  const end = moment().endOf("week").toDate();
  return { start, end };
};
const getShamsiMonthRange = (): TimeRange => {
  //@ts-ignore
  const start = moment().startOf("jMonth").toDate();
  //@ts-ignore
  const end = moment().endOf("jMonth").toDate();
  return { start, end };
};
class OrderController extends Controller {
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      let filters = {
        status: "paid",
      };
      switch (req.query.period) {
        case "today": {
          let { start, end } = getTodayRange();
          //@ts-ignore
          filters.createdAt = {
            $gte: start,
            $lte: end,
          };
          break;
        }
        case "week": {
          let { start, end } = getWeekRange();
          //@ts-ignore
          filters.createdAt = {
            $gte: start,
            $lte: end,
          };
          break;
        }
        case "month": {
          let { start, end } = getShamsiMonthRange();
          //@ts-ignore
          filters.createdAt = {
            $gte: start,
            $lte: end,
          };
          break;
        }
        default:
      }
      if (req.query.postType) {
        //@ts-ignore
        filters.postType = req.query.postType as
          | "normal"
          | "pishtaz"
          | "peyk"
          | "nothing";
      }
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      if (req.query.user) {
        //@ts-ignore
        filters["user"] = req.query.user as string;
      }
      if (req.query.res_number) {
        //@ts-ignore
        filters.res_number = req.query.res_number as string;
      }
      if (req.query.tracking_id) {
        //@ts-ignore
        filters.trackingId = Number(req.query.tracking_id);
      }
      const orders = await this.Order.find(filters)
        .populate(["user", "address"])
        .select("-products");
      let price = 0;
      orders.forEach((order) => {
        price += order.totalPrice + order.postPrice;
      });
      res.json({ orders, price });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    try {
      const orders = await this.Order.find({ "user._id": userId }).populate(
        "user"
      );
      res.json(orders);
    } catch (error) {
      console.error("Error finding orders by userId:", error);
      res.status(500).json({ error: "Error finding orders by userId" });
    }
  }
  async getOrderById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const order = await this.Order.findById(id).populate("user");
      return res.json({ order });
    } catch (error) {
      console.error("Error finding order by id:", error);
      return res.status(500).json({ error: "Error finding order by id" });
    }
  }
  getAllConfigs: RequestHandler = async (req, res) => {
    try {
      const configs = await Config.find({});
      return res.status(200).json({ configs: configs });
    } catch (error) {
      console.log(`getAllConfigsErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };
  setConfigs: RequestHandler = async (req, res) => {
    try {
      const validKeys = [
        "BannerBasePrice",
        "CoverBasePrice",
        "PaperBasePrice",
        "BrochureBasePrice",
        "CardBasePrice",
        "CatalogBasePrice",
        "FlagBasePrice",
        "MugBasePrice",
        "NoteBookBasePrice",
        "baseOfficeSetHeader",
        "baseOfficeSetPocket",
        "paperOfficeRatioa4",
        "paperOfficeRatioa5",
        "pishtazPostPrice",
        "peykPrice",
        "StampBasePrice",
        "TShirtBasePrice",
        "postPrice",
        "photoChassisBasePrice",
      ];
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key) && validKeys.includes(key)) {
          const value = req.body[key];
          if (value !== null && value !== undefined) {
            await setConfigValueByKey(key, value);
          }
        }
      }
      return res.status(200).json({ message: "Config updated" });
    } catch (error) {
      console.log(`setConfigsErr : ${error}`);
      return res.status(500).json({
        message: "Internal server Error",
        result: null,
      });
    }
  };

  isValidStatus(status: string): boolean {
    const validStatuses = [
      "preparing",
      "expired",
      "sent",
      "sending",
      "rejected",
    ];
    return validStatuses.includes(status);
  }

  // Controller function to update the status of an order by ID
  async updateOrderStatus(req: Request, res: Response): Promise<void|Response> {
    try {
      const { orderId, productId } = req.params;
      const { status } = req.body;
      const validStatuses = [
        "preparing",
        "expired",
        "sent",
        "sending",
        "rejected",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const order = await this.Order.findById(orderId).populate("user");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const product = order.products.find((p:any) => p._id == productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found in order" });
      }
      product.status = status;
      await order.save();
      console.log(product,order.user.phone.toString(),status);
     // await this.sendMessage(order.user.phone.toString(),status)
      res.json({ message: "Product status updated successfully" });
    } catch (error) {
      console.error("Error updating product status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  seeProductById :RequestHandler = async (req, res) => {
    const { orderId, productId } = req.params;
      const order = await this.Order.findById(orderId).populate("user");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const product = order.products.find((p:any) => p._id == productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found in order" });
      }
      return res.status(200).json({product})
  }
  getProducts: RequestHandler = async (req, res) => {
    try {
      let filter: NodeJS.Dict<string> = {};
      if (req.query.status && typeof req.query.status == "string") {
        filter["products.status"] = req.query.status;
      }
      const orders = await this.Order.find(filter, "_id products trackingId");
      let products: any[] = [];
      orders.forEach((order) => {
        const orderId = order._id;
        order.products.forEach((product: any) => {
          products.push({ orderId,trackingId : order.trackingId, ...product.toObject() });
        });
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new OrderController();
