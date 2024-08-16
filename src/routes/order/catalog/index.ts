import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();

import catalogController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.post("/price", catalogController.getCatalogPrice);
router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  catalogController.addCatalogToCart,
  catalogController.addToCart
);
export default router;
