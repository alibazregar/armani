import { Schema, model } from "mongoose";

export interface IMaterial {
  name: string;
  ratio: number;
  type:
    | "book"
    | "brochure"
    | "card"
    | "catalog"
    | "package"
    | "banner"
    | "officeSet"
    | "flag"
    | "photoChassis"
    | "popUpStand"
    | "box"
    | "bag"
    | "tShirt"
    | "food"
    | "cd"
    | "dvd"
    | "stick"
    | "foamBoard";
}
const MaterialSchema = new Schema<IMaterial>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
  type: {
    type: String,
    enum: [
      "book",
      "brochure",
      "card",
      "catalog",
      "package",
      "banner",
      "officeSet",
      "flag",
      "photoChassis",
      "popUpStand",
      "food",
      "cd",
      "dvd",
      "stick",
      "box",
      "bag",
      "tShirt",
      "foamBoard"
    ],
  },
});
const Material = model<IMaterial>("Material", MaterialSchema);
export default Material;
/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [book, brochure, card, catalog, package, banner, officeSet]
 *       required:
 *         - name
 *         - ratio
 *         - type
 */
