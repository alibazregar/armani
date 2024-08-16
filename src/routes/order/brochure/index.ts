import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();

import BrochureController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.post("/price", BrochureController.getBrochurePrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  BrochureController.addBrochureToCart,
  BrochureController.addToCart
);

export default router;
