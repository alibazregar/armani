import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import StandXController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", StandXController.getStandXPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  StandXController.addStandXToCart,
  StandXController.addToCart
);

export default router;
