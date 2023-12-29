import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import BrochureController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.get("/price", checkLogin, BrochureController.getBrochurePrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  BrochureController.payBrochurePrice,
  BrochureController.createOrderAndPayment
);


export default router;
