import { Router } from "express";
const router = Router();
import userController from "./controller";

router.post("/send-otp", userController.authSendCode);
router.post("/auth", userController.auth);
router.post("/resend-code", userController.resendCode);

export default router;
