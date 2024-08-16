import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import FlagController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", FlagController.getFlagPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  FlagController.addFlagToCart,
  FlagController.addToCart
);

export default router;
