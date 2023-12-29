import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import catalogController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.get("/price", checkLogin, catalogController.getCatalogPrice);
router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  catalogController.payCatalogPrice,
  catalogController.createOrderAndPayment
);
export default router;
