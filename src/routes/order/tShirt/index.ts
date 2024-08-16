import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import TShirtController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", TShirtController.getTShirtPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  TShirtController.addTShirtToCart,
  TShirtController.addToCart
);

export default router;
