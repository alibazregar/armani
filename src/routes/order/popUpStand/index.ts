import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import PopUpStandController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", PopUpStandController.getPopUpStandPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  PopUpStandController.addPopUpStandToCart,
  PopUpStandController.addToCart
);

export default router;
