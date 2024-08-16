import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import LabelController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", LabelController.getLabelPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  LabelController.addLabelToCart,
  LabelController.addToCart
);

export default router;
