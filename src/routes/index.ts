import { Router } from "express";
import userRouter from "./user/index";
import orderRouter from "./order/index";
const router = Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);

export default router;
