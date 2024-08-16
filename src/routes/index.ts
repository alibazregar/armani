import { Router } from "express";
import userRouter from "./user/index";
import orderRouter from "./order/index";
import BindingType from "./../models/attributes/BindingType";
import CoverType from "./../models/attributes/coverType";
import CoverPaper from "./../models/attributes/coverPaper";
import adminRouter from "./admin/index";
import { checkLogin, isAdmin } from "../middleware/checkLogin";
import Material from "./../models/attributes/material";
import Stand from "./../models/attributes/Stand";
import Type from "./../models/attributes/Type";
import PaperType from "./../models/attributes/paper/paperType";
import PaperColor from "./../models/attributes/paper/paperColor";
import Size from "../models/attributes/size";
import Model from "./../models/attributes/Model";
import OnPrint from "./../models/attributes/onPrint";
import Message from "./../models/message";
const router = Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/admin", checkLogin, isAdmin, adminRouter);
router.post("/message",async(req,res)=>{
  const message = req.body.message
  let newMsg = new Message({message})
  await newMsg.save()
  return res.send("saved")
})
/**
 * @swagger
 * /api/v1/attr/binding-type:
 *   get:
 *     summary: Get all binding types
 *     tags: [attributes,binding-type,book,brochure,card,catalog,package,banner]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/BindingType'
 *       404:
 *         description: No binding types found
 */
router.get("/attr/binding-type", async (req, res) => {
    try {
      const bindingTypes = await BindingType.find();
      res.json(bindingTypes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  /**
 * @swagger
 * /api/v1/attr/cover-type:
 *   get:
 *     summary: Get all cover types
 *     description: Retrieves all cover types.
 *     tags: [attributes,cover-type,book,brochure,card,catalog,package,banner,noteBook]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/CoverType'
 *       404:
 *         description: No cover types found
 */
router.get("/attr/cover-type", async (req, res) => {
  try {
    const coverTypes = await CoverType.find();
    res.json(coverTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/stand:
 *   get:
 *     summary: Get all stands
 *     tags: [attributes,stand,flag,banner]
 *     description: Retrieves all stands.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Stand'
 *       404:
 *         description: No stands found
 */
router.get("/attr/stand", async (req, res) => {
  try {
    const stands = await Stand.find();
    res.json(stands);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/type:
 *   get:
 *     summary: Get all types
 *     tags: [attributes,type,mug,stamp]
 *     description: Retrieves all types.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Type'
 *       404:
 *         description: No types found
 */
router.get("/attr/type", async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/paper-color:
 *   get:
 *     summary: Get all paper colors
 *     tags: [attributes,paper-color,book,catalog]
 *     description: Retrieves all paper colors.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaperColor'
 *       404:
 *         description: No paper colors found
 */
router.get("/attr/paper-color", async (req, res) => {
  try {
    const paperColors = await PaperColor.find();
    res.json(paperColors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/paper-type:
 *   get:
 *     summary: Get all paper types
 *     tags: [attributes,paper-type,book,catalog]
 *     description: Retrieves all paper types.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaperType'
 *       404:
 *         description: No paper types found
 */
router.get("/attr/paper-type", async (req, res) => {
  try {
    const paperTypes = await PaperType.find();
    res.json(paperTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/binding-type:
 *   get:
 *     summary: Get all binding types
 *     tags: [attributes,binding-type]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/BindingType'
 *       404:
 *         description: No binding types found
 */
router.get("/attr/binding-type", async (req, res) => {
  try {
    const bindingTypes = await BindingType.find();
    res.json(bindingTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/material:
 *   get:
 *     summary: Get all materials
 *     tags: [attributes,material,book,brochure,card,catalog,package,banner,officeSet]
 *     description: Retrieves all materials.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/Material'
 *       404:
 *         description: No materials found
 */
router.get("/attr/material", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/SIZE:
 *   get:
 *     summary: Get all SIZES
 *     tags: [attributes,size,book,brochure,card,catalog,package,banner,flag,tShirt]
 *     description: Retrieves all sizes.
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/Material'
 *       404:
 *         description: No materials found
 */
router.get("/attr/size", async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/model:
 *   get:
 *     summary: Get all models
 *     tags: [attributes,model,stamp]
 *     description: Retrieves all models.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/Model'
 *       404:
 *         description: No models found
 */
router.get("/attr/model", async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/attr/on-print:
 *   get:
 *     summary: Get all on-prints
 *     tags: [attributes,on-print,book,brochure,card,catalog,package,banner,officeSet]
 *     description: Retrieves all on-prints.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/OnPrint'
 *       404:
 *         description: No on-prints found
 */
router.get("/attr/on-print", async (req, res) => {
  try {
    const onPrints = await OnPrint.find();
    res.json(onPrints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
  /**
 * @swagger
 * /api/v1/attr/cover-paper:
 *   get:
 *     summary: Get all cover papers
 *     description: Retrieves all cover papers.
 *     tags: [attributes,cover-paper,book,brochure,card,catalog,package,banner,noteBook]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/schemas/CoverType'
 *       404:
 *         description: No cover papers found
 */
  router.get("/attr/cover-paper", async (req, res) => {
    try {
      const coverPapers = await CoverPaper.find();
      res.json(coverPapers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
export default router;
