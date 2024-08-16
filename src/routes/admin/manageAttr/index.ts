import { Router } from "express";
const router = Router();
import BindingType from "../../../models/attributes/BindingType";
import CoverType from "../../../models/attributes/coverType";
import CoverPaper from "../../../models/attributes/coverPaper";
import Material from "../../../models/attributes/material";
import Model from "../../../models/attributes/Model";
import OnPrint from "../../../models/attributes/onPrint";
import Size from "../../../models/attributes/size";
import Stand from "../../../models/attributes/Stand";
import Type from "../../../models/attributes/Type";
import PaperType from "../../../models/attributes/paper/paperType";
import PaperColor from "../../../models/attributes/paper/paperColor";
/**
 * @swagger
 * /api/v1/admin/attr/binding-type:
 *   post:
 *     summary: Create a new binding type \ صحافی
 *     tags: [Admin,attributes,binding-type,book,brochure,card,catalog,package,banner]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bindingType
 *         description: Binding Type object to create
 *         schema:
 *           $ref: '#/schemas/BindingType'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/binding-type", async (req, res) => {
  try {
    const bindingType = new BindingType(req.body);
    await bindingType.save();
    res.status(201).json(bindingType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/v1/admin/attr/binding-type/{id}:
 *   put:
 *     summary: Update a binding type by ID\ صحافی
 *     security:
 *       - BearerAuth: []
 *     tags: [Admin,attributes,binding-type,book,brochure,card,catalog,package,banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the binding type to update
 *       - in: body
 *         name: bindingType
 *         description: Updated binding type object
 *         schema:
 *           $ref: '#/schemas/BindingType'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Binding type not found
 */
router.put("/binding-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBindingType = await BindingType.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedBindingType) {
      return res.status(404).json({ message: "Binding type not found" });
    }
    res.json(updatedBindingType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/binding-type/{id}:
 *   delete:
 *     summary: Delete a binding type by ID
 *     tags: [Admin,attributes,binding-type,book,brochure,card,catalog,package,banner]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the binding type to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Binding type not found
 */
router.delete("/binding-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBindingType = await BindingType.findByIdAndDelete(id);
    if (!deletedBindingType) {
      return res.status(404).json({ message: "Binding type not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/cover-type:
 *   post:
 *     summary: Create a new cover type \ 
 *     description: Creates a new cover type with the specified name, ratio, and type.
 *     tags: [Admin,attributes,cover-type,book,brochure,card,catalog,package,banner,noteBook]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: coverType
 *         description: Cover Type object to create
 *         schema:
 *           $ref: '#/schemas/CoverType'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/cover-type", async (req, res) => {
  try {
    const coverType = new CoverType(req.body);
    await coverType.save();
    res.status(201).json(coverType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/cover-type/{id}:
 *   delete:
 *     tags: [Admin,attributes,cover-type,book,brochure,card,catalog,package,banner,noteBook]
 *     summary: Delete a cover type by ID
 *     description: Deletes a cover type with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the cover type to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Cover type not found
 */
router.delete("/cover-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoverType = await CoverType.findByIdAndDelete(id);
    if (!deletedCoverType) {
      return res.status(404).json({ message: "Cover type not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/material:
 *   post:
 *     tags: [Admin,attributes,material,book,brochure,card,catalog,package,banner,officeSet]
 *     summary: Create a new material
 *     description: Creates a new material with the specified name, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: material
 *         description: Material object to create
 *         schema:
 *           $ref: '#/schemas/Material'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/material", async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/v1/admin/attr/material/{id}:
 *   delete:
 *     tags: [Admin,attributes,material,book,brochure,card,catalog,package,banner,officeSet]
 *     summary: Delete a material by ID
 *     description: Deletes a material with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the material to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Material not found
 */
router.delete("/material/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/model:
 *   post:
 *     tags: [Admin,attributes,model,stamp]
 *     summary: Create a new model
 *     description: Creates a new model with the specified name, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: model
 *         description: Model object to create
 *         schema:
 *           $ref: '#/schemas/Model'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/model", async (req, res) => {
  try {
    const model = new Model(req.body);
    await model.save();
    res.status(201).json(model);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/model/{id}:
 *   put:
 *     summary: Update a model by ID
 *     tags: [Admin,attributes,model,stamp]
 *     description: Updates a model with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the model to update
 *       - in: body
 *         name: model
 *         description: Updated model object
 *         schema:
 *           $ref: '#/schemas/Model'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Model not found
 */
router.put("/model/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedModel = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedModel) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(updatedModel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/model/{id}:
 *   delete:
 *     summary: Delete a model by ID
 *     tags: [Admin,attributes,model,stamp]
 *     description: Deletes a model with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the model to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Model not found
 */
router.delete("/model/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedModel = await Model.findByIdAndDelete(id);
    if (!deletedModel) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/on-print:
 *   post:
 *     summary: Create a new on-print
 *     tags: [Admin,attributes,on-print,book,brochure,card,catalog,package,banner,officeSet]
 *     description: Creates a new on-print with the specified name, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: onPrint
 *         description: On-Print object to create
 *         schema:
 *           $ref: '#/schemas/OnPrint'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/on-print", async (req, res) => {
  try {
    const onPrint = new OnPrint(req.body);
    await onPrint.save();
    res.status(201).json(onPrint);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/on-print/{id}:
 *   delete:
 *     summary: Delete an on-print by ID
 *     tags: [Admin,attributes,on-print,book,brochure,card,catalog,package,banner,officeSet]
 *     description: Deletes an on-print with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the on-print to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: On-print not found
 */
router.delete("/on-print/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOnPrint = await OnPrint.findByIdAndDelete(id);
    if (!deletedOnPrint) {
      return res.status(404).json({ message: "On-print not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/size:
 *   post:
 *     summary: Create a new size
 *     tags: [Admin,attributes,size,book,brochure,card,catalog,package,banner,flag,tShirt]
 *     description: Creates a new size with the specified value, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: size
 *         description: Size object to create
 *         schema:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/size", async (req, res) => {
  try {
    const size = new Size(req.body);
    await size.save();
    res.status(201).json(size);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/size/{id}:
 *   put:
 *     summary: Update a size by ID
 *     tags: [Admin,attributes,size,book,brochure,card,catalog,package,banner,flag,tShirt]
 *     description: Updates a size with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the size to update
 *       - in: body
 *         name: size
 *         description: Updated size object
 *         schema:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Size not found
 */
router.put("/size/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSize = await Size.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSize) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(updatedSize);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/size/{id}:
 *   delete:
 *     summary: Delete a size by ID
 *     tags: [Admin,attributes,size,book,brochure,card,catalog,package,banner,flag,tShirt]
 *     description: Deletes a size with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the size to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Size not found
 */
router.delete("/size/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSize = await Size.findByIdAndDelete(id);
    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/stand:
 *   post:
 *     summary: Create a new stand
 *     tags: [Admin,attributes,stand,flag,banner]
 *     description: Creates a new stand with the specified name, price, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: stand
 *         description: Stand object to create
 *         schema:
 *           $ref: '#/components/schemas/Stand'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/stand", async (req, res) => {
  try {
    const stand = new Stand(req.body);
    await stand.save();
    res.status(201).json(stand);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/v1/admin/attr/stand/{id}:
 *   put:
 *     summary: Update a stand by ID
 *     tags: [Admin,attributes,stand,flag,banner]
 *     description: Updates a stand with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the stand to update
 *       - in: body
 *         name: stand
 *         description: Updated stand object
 *         schema:
 *           $ref: '#/components/schemas/Stand'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Stand not found
 */
router.put("/stand/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStand = await Stand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStand) {
      return res.status(404).json({ message: "Stand not found" });
    }
    res.json(updatedStand);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/type:
 *   post:
 *     summary: Create a new type
 *     tags: [Admin,attributes,type,mug,stamp]
 *     description: Creates a new type with the specified name, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: type
 *         description: Type object to create
 *         schema:
 *           $ref: '#/components/schemas/Type'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/type", async (req, res) => {
  try {
    const type = new Type(req.body);
    await type.save();
    res.status(201).json(type);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/v1/admin/attr/type/{id}:
 *   put:
 *     summary: Update a type by ID
 *     tags: [Admin,attributes,type,mug,stamp]
 *     description: Updates a type with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the type to update
 *       - in: body
 *         name: type
 *         description: Updated type object
 *         schema:
 *           $ref: '#/components/schemas/Type'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Type not found
 */
router.put("/type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedType = await Type.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedType) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.json(updatedType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/type/{id}:
 *   delete:
 *     summary: Delete a type by ID
 *     tags: [Admin,attributes,type,mug,stamp]
 *     description: Deletes a type with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the type to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Type not found
 */
/**
 * @swagger
 * /api/v1/admin/attr/paper-color:
 *   post:
 *     summary: Create a new paper color
 *     tags: [Admin,attributes,paper-color,book,catalog]
 *     description: Creates a new paper color with the specified name and ratio.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: paperColor
 *         description: Paper color object to create
 *         schema:
 *           $ref: '#/components/schemas/PaperColor'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/paper-color", async (req, res) => {
  try {
    const paperColor = new PaperColor(req.body);
    await paperColor.save();
    res.status(201).json(paperColor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/v1/admin/attr/paper-color/{id}:
 *   put:
 *     summary: Update a paper color by ID
 *     tags: [Admin,attributes,paper-color,book,catalog]
 *     description: Updates a paper color with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the paper color to update
 *       - in: body
 *         name: paperColor
 *         description: Updated paper color object
 *         schema:
 *           $ref: '#/components/schemas/PaperColor'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Paper color not found
 */
router.put("/paper-color/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPaperColor = await PaperColor.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPaperColor) {
      return res.status(404).json({ message: "Paper color not found" });
    }
    res.json(updatedPaperColor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/paper-color/{id}:
 *   delete:
 *     summary: Delete a paper color by ID
 *     tags: [Admin,attributes,paper-color,book,catalog]
 *     description: Deletes a paper color with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the paper color to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Paper color not found
 */
router.delete("/paper-color/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPaperColor = await PaperColor.findByIdAndDelete(id);
    if (!deletedPaperColor) {
      return res.status(404).json({ message: "Paper color not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/paper-type:
 *   post:
 *     summary: Create a new paper type
 *     tags: [Admin,attributes,paper-type,book,catalog]
 *     description: Creates a new paper type with the specified name, ratio, and type.
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: paperType
 *         description: Paper type object to create
 *         schema:
 *           $ref: '#/components/schemas/PaperType'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/paper-type", async (req, res) => {
  try {
    const paperType = new PaperType(req.body);
    await paperType.save();
    res.status(201).json(paperType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/v1/admin/attr/paper-type/{id}:
 *   put:
 *     summary: Update a paper type by ID
 *     tags: [Admin,attributes,paper-type,book,catalog]
 *     description: Updates a paper type with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the paper type to update
 *       - in: body
 *         name: paperType
 *         description: Updated paper type object
 *         schema:
 *           $ref: '#/components/schemas/PaperType'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Paper type not found
 */
router.put("/paper-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPaperType = await PaperType.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPaperType) {
      return res.status(404).json({ message: "Paper type not found" });
    }
    res.json(updatedPaperType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/paper-type/{id}:
 *   delete:
 *     summary: Delete a paper type by ID
 *     tags: [Admin,attributes,paper-type,book,catalog]
 *     description: Deletes a paper type with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the paper type to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Paper type not found
 */
router.delete("/paper-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPaperType = await PaperType.findByIdAndDelete(id);
    if (!deletedPaperType) {
      return res.status(404).json({ message: "Paper type not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/v1/admin/attr/cover-Paper:
 *   post:
 *     summary: Create a new cover Paper \ 
 *     description: Creates a new cover Paper with the specified name, ratio, and Paper.
 *     tags: [Admin,attributes,cover-Paper,book,brochure,card,catalog,package,banner,noteBook]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: coverPaper
 *         description: Cover Paper object to create
 *         schema:
 *           $ref: '#/schemas/CoverPaper'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid request body
 */
router.post("/cover-Paper", async (req, res) => {
  try {
    const coverPaper = new CoverPaper(req.body);
    await coverPaper.save();
    res.status(201).json(coverPaper);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/admin/attr/cover-Paper/{id}:
 *   delete:
 *     tags: [Admin,attributes,cover-Paper,book,brochure,card,catalog,package,banner,noteBook]
 *     summary: Delete a cover Paper by ID
 *     description: Deletes a cover Paper with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         Paper: string
 *         description: ID of the cover Paper to delete
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Cover Paper not found
 */
router.delete("/cover-Paper/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoverPaper = await CoverPaper.findByIdAndDelete(id);
    if (!deletedCoverPaper) {
      return res.status(404).json({ message: "Cover Paper not found" });
    }
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
