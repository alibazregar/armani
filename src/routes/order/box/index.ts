import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import BoxController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", BoxController.getBoxPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  BoxController.addBoxToCart,
  BoxController.addToCart
);

export default router;
