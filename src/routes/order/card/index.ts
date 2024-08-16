import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import CardController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", CardController.getCardPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  CardController.addCardToCart,
  CardController.addToCart
);

export default router;
