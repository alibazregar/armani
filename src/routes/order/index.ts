import { Router } from "express";

const router = Router();
import bookRouter from "./book/index";
import brochureRouter from "./brochure/index"
import { checkLogin } from "../../middleware/checkLogin";


router.use("/book",checkLogin, bookRouter);
router.use("/brochure",checkLogin,brochureRouter);

export default router;
