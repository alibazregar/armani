import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import MugController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", MugController.getMugPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  MugController.addMugToCart,
  MugController.addToCart
);

export default router;
