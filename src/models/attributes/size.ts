import { Schema, model } from "mongoose";

export interface ISize {
  value: string;
  ratio: number;
  type:
    | "book"
    | "brochure"
    | "card"
    | "catalog"
    | "package"
    | "banner"
    | "flag"
    | "noteBook"
    | "tShirt"
    | "banner"
    | "photoChassis"
    | "foamBoard"
    | "popUpStand"
    | "food"
    | "cd"
    | "dvd"
    | "stick"
    | "box"
    | "bag";
}

const SizeSchema = new Schema<ISize>({
  value: { type: String, required: true },
  ratio: Number,
  type: {
    type: String,
    enum: [
      "book",
      "brochure",
      "card",
      "catalog",
      "package",
      "banner",
      "flag",
      "tShirt",
      "photoChassis",
      "popUpStand",
      "foamBoard",
      "food",
      "cd",
      "dvd",
      "stick",
      "box",
      "bag",
    ],
  },
});
const Size = model<ISize>("Size", SizeSchema);
export default Size;
/**
 * @swagger
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       properties:
 *         value:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *             width:
 *               type: number
 *             height:
 *               type: number
 *           additionalProperties: false
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [book, brochure, card, catalog, package, banner, flag, tShirt]
 *       required:
 *         - value
 *         - ratio
 *         - type
 */
