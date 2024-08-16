import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import BannerController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", BannerController.getBannerPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  BannerController.addBannerToCart,
  BannerController.addToCart
);

export default router;
