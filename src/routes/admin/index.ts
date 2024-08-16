import { Router } from "express";
const router = Router();
import adminController from "./controller";
import attrRouter from "./manageAttr/index";
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: APIs for admin operations
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */
/**
 * Set configuration values.
 *
 * @swagger
 * /api/v1/admin/set-configs:
 *   post:
 *     summary: Set configuration values
 *     description: Set configuration values for various settings.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BannerBasePrice:
 *                 type: number
 *                 description: The base price for banners.
 *               CoverBasePrice:
 *                 type: number
 *                 description: The base price for covers.
 *               PaperBasePrice:
 *                 type: number
 *                 description: The base price for paper.
 *               BrochureBasePrice:
 *                 type: number
 *                 description: The base price for brochures.
 *               CardBasePrice:
 *                 type: number
 *                 description: The base price for cards.
 *               CatalogBasePrice:
 *                 type: number
 *                 description: The base price for catalogs.
 *               FlagBasePrice:
 *                 type: number
 *                 description: The base price for flags.
 *               MugBasePrice:
 *                 type: number
 *                 description: The base price for mugs.
 *               NoteBookBasePrice:
 *                 type: number
 *                 description: The base price for notebooks.
 *               baseOfficeSetHeader:
 *                 type: number
 *                 description: The header value for the base office set.
 *               baseOfficeSetPocket:
 *                 type: number
 *                 description: The pocket value for the base office set.
 *               paperOfficeRatioA4:
 *                 type: number
 *                 description: The ratio value for paper size A4.
 *               paperOfficeRatioA5:
 *                 type: number
 *                 description: The ratio value for paper size A5.
 *               StampBasePrice:
 *                 type: number
 *                 description: The base price for stamps.
 *               TShirtBasePrice:
 *                 type: number
 *                 description: The base price for T-shirts.
 *               postPrice:
 *                 type: number
 *                 description: The price for posting.
 *     responses:
 *       '200':
 *         description: Configuration values successfully set.
 *       '400':
 *         description: Invalid request payload.
 *       '401':
 *         description: Unauthorized. Missing or invalid token.
 *       '500':
 *         description: Internal server error.
 */
// Endpoint to retrieve products with an option to filter by product status
router.get("/products", adminController.getProducts);
router.post("/set-configs", adminController.setConfigs);

router.put(
  "/orders/:orderId/products/:productId/status",
  adminController.updateOrderStatus
);
router.get(
  "/orders/:orderId/products/:productId/see",
  adminController.seeProductById
);
/**
 * @swagger
 * /api/v1/admin/get-configs:
 *   get:
 *     summary: Get all configurations
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 configs:
 *                   type: array
 *                   items:
 *                     {StampBasePrice: string}
 *       '500':
 *         description: Internal server error
 */
router.get("/get-configs", adminController.getAllConfigs);
/**
 * @swagger
 * /api/v1/admin/get-orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal server error
 */
router.get("/get-orders", adminController.getOrders);
/**
 * @swagger
 * /api/v1/admin/get-orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Internal server error
 */
router.get("/order/:id", adminController.getOrderById);
/**
 * @swagger
 * /api/v1/admin/get-orders-user/{userId}:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal server error
 */
router.get("/get-orders-user/:userId", adminController.getOrdersByUserId);
router.use("/attr", attrRouter);

export default router;
