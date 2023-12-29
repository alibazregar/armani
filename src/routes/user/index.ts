import { Router } from "express";
const router = Router();
import userController from "./controller";
/**
 * @swagger
 * /api/v1/user//send-otp:
 *   post:
 *     summary: Send authentication code to the user's phone number.
 *     description: |
 *       This endpoint sends an authentication code to the user's phone number.
 *       If the user doesn't exist, a new user is created with the provided phone number.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The request body containing the user's phone number.
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: The user's phone number.
 *     responses:
 *       200:
 *         description: The authentication code is sent successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A success message.
 *             result:
 *               type: string
 *               description: The phone number to which the code is sent.
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating internal server error.
 *             result:
 *               type: null
 *               description: Result is null in case of an error.
 */
router.post("/send-otp", userController.authSendCode);
/**
 * @swagger
 * /api/v1/user/auth:
 *   post:
 *     summary: Authenticate user using phone number and OTP code.
 *     description: |
 *       This endpoint authenticates the user using their phone number and OTP code.
 *       After successful authentication, a JWT token is generated for further access.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The request body containing the user's phone number and OTP code.
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: The user's phone number.
 *             code:
 *               type: string
 *               description: The OTP code entered by the user.
 *     responses:
 *       201:
 *         description: Login was successful, and a JWT token is generated.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A success message.
 *             result:
 *               type: string
 *               description: The generated JWT token.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating the reason for the bad request.
 *             result:
 *               type: null
 *               description: Result is null in case of a bad request.
 *       403:
 *         description: Too many login attempts; try again after one minute.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: An error message indicating that there are too many login attempts.
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating internal server error.
 *             result:
 *               type: null
 *               description: Result is null in case of an internal server error.
 */
router.post("/auth", userController.auth);
/**
 * @swagger
 * /api/v1/user/resendCode:/{phoneStr}:
 *   get:
 *     summary: Resend authentication code to the user's phone number.
 *     description: |
 *       This endpoint resends an authentication code to the user's phone number.
 *     parameters:
 *       - in: path
 *         name: phoneStr
 *         required: true
 *         description: The phone number of the user to whom the code should be resent.
 *         schema:
 *           type: string
 *           minLength: 11
 *           maxLength: 11
 *     responses:
 *       200:
 *         description: The authentication code is resent successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A success message.
 *             result:
 *               type: null
 *               description: Result is null for successful resending of the code.
 *       400:
 *         description: Bad request due to an incorrect phone number.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating the reason for the bad request.
 *             result:
 *               type: null
 *               description: Result is null in case of a bad request.
 *       404:
 *         description: User not found with the provided phone number.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating that the user was not found.
 *             result:
 *               type: null
 *               description: Result is null in case of user not found.
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: An error message indicating internal server error.
 *             result:
 *               type: null
 *               description: Result is null in case of an internal server error.
 */
router.post("/resend-code/phone", userController.resendCode);

export default router;
