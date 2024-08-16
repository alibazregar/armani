import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
const router = Router();
import NoteBookController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";

router.post("/price", NoteBookController.getNoteBookPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  //@ts-ignore
  NoteBookController.payNoteBookPrice,
  NoteBookController.addToCart
);

export default router;
