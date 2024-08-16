import Controller from "../controller";
import { Response } from "express";
import { getConfigValueByKey } from "../../models/config";
import axios from "axios";
import { model } from "mongoose";
import { error } from "console";
import fs from "fs";
import path from "path";
import { ICart } from "./../../models/cart";
export default class OrderController extends Controller {
  createOrderAndPayment = async (
    req: CustomRequest,
    res: Response
  ): Promise<void | Response> => {
    const { postType, addressId } = req.body;
    let postPrice: number;
    if (postType == "normal") {
      postPrice = await getConfigValueByKey("postPrice");
    } else if (postType == "pishtaz") {
      postPrice = await getConfigValueByKey("pishtazPostPrice");
    } else if (postType == "peyk") {
      postPrice = await getConfigValueByKey("peykPrice");
    } else {
      postPrice = 0;
    }
    const cart = await this.Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw new Error(`Cart not found`);
    }
    const result = await this.getCartProductsAndPrices(cart, res, req, true);
    if (!result) {
      //@ts-ignore
      return;
    }
    const { products, totalPrice } = result;
    console.log("in pay",totalPrice,postPrice)
    let trackingId 
    do {
      let randomNumber = this.generateRandomNumber();
      const existingDoc = await this.Order.findOne({
        trackingId: randomNumber,
      });
      if (!existingDoc) {
        trackingId = randomNumber;
        break;
      }
    } while (true);
    const params = {
      merchant_id: process.env.MERCHANT_ID,
      amount: totalPrice + postPrice,
      callback_url: process.env.BASE_URL + "api/v1/order/payment-cb",
      description: "payment",
      metadata : {
        order_id: trackingId
      }
    };
    const response = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      params
    );

    console.log(JSON.stringify(response.data));
    if (response.data.data.code == 100) {
      const newOrder = new this.Order({
        user: req.user?._id,
        products: products,
        address: addressId,
        postType: postType,
        totalPrice: totalPrice,
        postPrice: postPrice,
        res_number: response.data.data.authority,
        trackingId : trackingId
      });
      console.log(newOrder)
      await newOrder.save();
      return res.status(200).json({
        message: null,
        result: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
      });
    } else {
      return res.status(400).send("error");
    }
  };
  payCallBack = async (req: CustomRequest, res: Response) => {
    try {
      console.log(req.query)
      // TODO:: implement payment call back API and save the transaction to database
      if (req.query.Status && req.query.Status !== "OK") {
        return res.redirect(
          process.env.REDIRECT_FAILED_URL + `?message="invalid payment"`
        );
      }
      let order = await this.Order.findOne({
        resNumber: req.query.Authority,
      });
      if (!order) {
        return res.redirect(
          process.env.REDIRECT_FAILED_URL + `?message="invalid payment"`
        );
      }
      console.log("cb",order)
      let params = {
        merchant_id: process.env.MERCHANT_ID,
        amount: order.totalPrice + order.postPrice,
        authority: req.query.Authority,
      };
      console.log("ddddddddddddddddd",params.amount);
      const response = await axios.post(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        params
      );
      console.log(JSON.stringify(response.data));
      if (response.data.data.code == 100) {
        order.status = "paid";
        const cart = await this.Cart.findOne({ user: order.user });
        if (!cart) {
          return res.status(200).json({ message: "server-error" });
        }
        cart.cart = [];
        await order.save();
        return res.redirect(
          process.env.REDIRECT_SUCCESSFUL_URL +
            `?message="successful"&paymentId="${order.trackingId}"`
        );
      } else {
        order.status = "expired";
        await order.save();
        return res.redirect(
          process.env.REDIRECT_FAILED_URL +
            `?message="expired"&paymentId="${order.trackingId}"`
        );
      }
    } catch (error) {
      console.log(`paymentCallbackErr : ${error}`);
      return res
        .status(500)
        .json({ message: "متاسفانه ارتباط برقرار نگردید", result: null });
    }
  };
  addToCart = async (req: CustomRequest, res: Response): Promise<Response> => {
    const userCart = await this.Cart.findOne({ user: req.user._id });
    if (!userCart) {
      return res.status(500).json({ message: "cart not found;server error" });
    }
    if (!req.savedOrder || !req.files || !req.orderType) {
      return res.status(500).json({ message: "invalid argument;server error" });
    }
    userCart.cart.push({
      product: req.savedOrder,
      itemType: req.orderType,
      //@ts-ignore
      media: req.files.files.map((file) => {
        return { path: process.env.BASE_URL + file.path };
      }),
      description: req.body.description,
      number: req.body.number,
    });
    await userCart.save();
    return res.status(200).json({ message: "item saved" });
  };
  async modifyCart(
    req: CustomRequest,
    res: Response
  ): Promise<void | Response> {
    try {
      const { productId, newNumber } = req.body;
      const userId = req.user._id;
      const cart = await this.Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found for the user" });
      }
      const productIndex = cart.cart.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Product not found in the cart" });
      }
      cart.cart[productIndex].number = newNumber;
      if (newNumber === 0) {
        const dynamicModel = model(cart.cart[productIndex].itemType);
        if (cart.cart[productIndex]) {
          const deleteMap = cart.cart[productIndex].media?.map((item) => {
            return fs.promises.unlink(path.join("/app/","/public",item.path.split("/public")[1]));
          });
          await Promise.all(deleteMap ?? []);
        }
        cart.cart.splice(productIndex, 1);
        const order = await dynamicModel.findByIdAndDelete(productId);
        //@ts-ignore
        if(order?.filePath ){
          //@ts-ignore
         await fs.promises.unlink("/app/",path.join(__dirname,order?.filePath ))
        }
      }
      await cart.save();

      res.json({ message: "Cart updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  seeCart = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const cart = await this.Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res
          .status(500)
          .json({ message: "cart not found - internal error" });
      }
      const result = await this.getCartProductsAndPrices(cart, res, req);
      if (!result) {
        //@ts-ignore
        return;
      } else {
        const { products, totalPrice } = result;
        return res.status(200).json({ products, totalPrice });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  async getCartProductsAndPrices(
    cart: ICart,
    res: Response,
    req: CustomRequest,
    isForPayment: boolean = false
  ): Promise<{ products: any; totalPrice: number } | undefined> {
    let totalPrice = 0;
    //@ts-ignore
    let products = [];
    if (cart.cart.length === 0) {
      res.status(200).json({totalPrice: 0, products : []});
    } else {
      const promises = cart.cart.map(async (cartItem) => {
        let product;
        switch (cartItem.itemType) {
          case "BookOrder":
            product = await this.BookOrder.findById(cartItem.product).populate([
              "paper.type",
              "paper.color",
              "cover.type",
              "cover.binding",
              "size",
              "cover.paper",
            ]);
            break;
          case "OfficeSet":
            product = await this.OfficeSet.findById(cartItem.product).populate([
              "paperTypes.header.onPrint",
              "paperTypes.pocket.onPrint",
              "paperTypes.header.material",
              "paperTypes.pocket.material",
            ]);
            break;
          case "BannerOrder":
            product = await this.BannerOrder.findById(
              cartItem.product
            ).populate(["size", "stand"]);
            break;
          case "OfficeSet":
            product = await this.OfficeSet.findById(cartItem.product).populate([
              "paperTypes.header.onPrint",
              "paperTypes.pocket.onPrint",
              "paperTypes.header.material",
              "paperTypes.pocket.material",
            ]);
          case "BrochureOrder":
            product = await this.BrochureOrder.findById(
              cartItem.product
            ).populate(["material", "onPrint", "size"]);
            break;
          case "FlagOrder":
            product = await this.FlagOrder.findById(cartItem.product).populate([
              "material",
              "stand",
              "type",
            ]);
            break;
          case "CardOrder":
            product = await this.CardOrder.findById(cartItem.product).populate([
              "material",
              "onPrint",
              "size",
            ]);
            break;
          case "PhotoChassis":
            product = await this.PhotoChassis.findById(
              cartItem.product
            ).populate(["material", "coverType", "size"]);
          break  
          case "CatalogOrder":
            product = await this.CatalogOrder.findById(
              cartItem.product
            ).populate([
              "onPrint",
              "size",
              "paper.type",
              "paper.color",
              "binding",
              "cover.type",
            ]);
            break;
          case "MugOrder":
            product = await this.MugOrder.findById(cartItem.product).populate([
              "type",
            ]);
            break;
          case "NoteBookOrder":
            product = await this.NoteBookOrder.findById(
              cartItem.product
            ).populate(["coverType"]);
            break;
          case "TShirtOrder":
            product = await this.TShirtOrder.findById(
              cartItem.product
            ).populate(["size", "material"]);
            break;
          case "StampOrder":
            product = await this.StampOrder.findById(cartItem.product).populate(
              ["type", "model"]
            );
            break;
          case "Box":
            product = await this.Box.findById(cartItem.product).populate([
              "material",
              "onPrint",
              "size",
            ]);
            break;
          case "FoamBoardOrder":
            product = await this.FoamBoardOrder.findById(
              cartItem.product
            ).populate(["material", "size"]);
            break;
          case "Label":
            product = await this.Label.findById(cartItem.product).populate([
              "material",
              "onPrint",
              "size",
            ]);
            break;
          case "PopUpStand":
            product = await this.PopUpStand.findById(cartItem.product).populate(
              ["material", "coverType", "size"]
            );
            break;
          case "StandXOrder":
            product = await this.StandXOrder.findById(
              cartItem.product
            ).populate(["model", "coverType"]);
            break;
          default:
            throw error("Invalid type : " + cartItem.itemType);
        }
        if (!product?.calculatePrice) {
          return 0;
        }
        const price = (await product.calculatePrice(cartItem.number)) || 0;
        let productData = {
          price,
          media: cartItem.media,
          product: JSON.parse(JSON.stringify(product)),
        };
        if (isForPayment) {
          products.push({ product: productData, status: "new" });
        } else {
          products.push(productData);
        }
        return price;
      });
      const prices = await Promise.all(promises);
      if (prices.length > 0) {
        totalPrice = prices.reduce((acc, curr) => acc + curr, 0);
      }
      //@ts-ignore
      console.log(products)
      //@ts-ignore
      return { products, totalPrice:Math.round(totalPrice) };
    }
  }
  getPostPrice = async (
    req: CustomRequest,
    res: Response
  ): Promise<Response> => {
    return res.status(200).json({
      post: await getConfigValueByKey("postPrice"),
      pishtaz: await getConfigValueByKey("pishtazPostPrice"),
      payk: await getConfigValueByKey("peykPrice"),
    });
  };
  generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
  }
}

export const orderController = new OrderController();
