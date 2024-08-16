import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import StampController from "./controller";

import { checkLogin } from "../../../middleware/checkLogin";
router.post("/price", StampController.getStampPrice);
router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  StampController.addStampToCart,
  StampController.addToCart
);

export default router;
