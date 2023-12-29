import { Router } from "express";
import uploadFile from "../../../middleware/uploadFile";
import uploadCover from "../../../middleware/uploadCover";
const router = Router();
import bookController from "./controller";
import { checkLogin } from "../../../middleware/checkLogin";
router.get("/price", checkLogin, bookController.getBookPrice);

router.post(
  "/create-order",
  checkLogin,
  uploadFile,
  uploadCover,
  //@ts-ignore
  bookController.payBookPrice,
  bookController.createOrderAndPayment
);
/**
 * @swagger
 * /api/v1/order/book/binding-types:
 *   get:
 *     summary: Get binding types
 *     description: Retrieve a list of binding types or a specific binding type by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the binding type to retrieve (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: {" _id" : mongoid ," name" : "example", "ratio" :1.3}
 *               results: [{" _id ": mongoid , "name" : "example"," ratio" :1.3},{" _id" : mongoid ," name" : "example2", "ratio" :1.4}]
 */
router.get("/binding-types",bookController.getBindingTypes)
/**
 * @swagger
 * /api/v1/order/book/cover-types:
 *   get:
 *     summary: Get cover types
 *     description: Retrieve a list of cover types or a specific cover type by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the cover type to retrieve (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: {" _id" : mongoid ," name" : "example", "ratio" :1.3}
 *               results: [{" _id ": mongoid , "name" : "example"," ratio" :1.3},{" _id" : mongoid ," name" : "example2", "ratio" :1.4}]
 */
router.get("cover-types",bookController.getCoverTypes)

router.get("/paper-colors",bookController.getPaperColors)
/**
 * @swagger
 * /api/v1/order/book/paper-colors:
 *   get:
 *     summary: Get paper colors
 *     description: Retrieve a list of paper colors or a specific paper color by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the paper color to retrieve (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: {" _id" : mongoid ," name" : "example", "ratio" :1.3}
 *               results: [{" _id ": mongoid , "name" : "example"," ratio" :1.3},{" _id" : mongoid ," name" : "example2", "ratio" :1.4}]
 */
router.get("/paper-types",bookController.getPaperTypes)
/**
 * @swagger
 * /api/v1/order/book/paper-types:
 *   get:
 *     summary: Get paper types
 *     description: Retrieve a list of paper types or a specific paper type by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the paper type to retrieve (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: {" _id" : mongoid ," name" : "example", "ratio" :1.3}
 *               results: [{" _id ": mongoid , "name" : "example"," ratio" :1.3},{" _id" : mongoid ," name" : "example2", "ratio" :1.4}]
 */
router.get("/size",bookController.getSize)
/**
 * @swagger
 * /api/v1/order/book/size:
 *   get:
 *     summary: Get book size
 *     description: Retrieve a list of sizes or a specific size by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the size to retrieve (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: {" _id" : mongoid ," name" : "example", "ratio" :1.3}
 *               results: [{" _id ": mongoid , "name" : "example"," ratio" :1.3},{" _id" : mongoid ," name" : "example2", "ratio" :1.4}]
 */
export default router;
