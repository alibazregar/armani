import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import OfficeSetController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.post("/price", OfficeSetController.getOfficeSetPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  OfficeSetController.addOfficeSetToCart,
  OfficeSetController.addToCart
);

export default router;
