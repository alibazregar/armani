import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import FoamBoardController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", FoamBoardController.getFoamBoardPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  FoamBoardController.addFoamBoardToCart,
  FoamBoardController.addToCart
);

export default router;
