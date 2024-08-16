import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import packageController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.post("/price", packageController.getPackagePrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  packageController.addPackageToCart,
  packageController.addToCart
);

export default router;
