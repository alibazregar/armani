import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import PhotoChassisController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", PhotoChassisController.getPhotoChassisPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  PhotoChassisController.addPhotoChassisToCart,
  PhotoChassisController.addToCart
);

export default router;
