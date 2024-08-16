import { Schema, model } from "mongoose";

export interface IOnPrint {
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
    | "food"
    | "cd"
    | "dvd"
    | "stick"
    | "box" | "bag";
}
const OnPrintSchema = new Schema<IOnPrint>({
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
      "food" , "cd" ,"dvd" , "stick",
      "box", "bag"
    ],
  },
});
const OnPrint = model<IOnPrint>("OnPrint", OnPrintSchema);
export default OnPrint;
/**
 * @swagger
 * components:
 *   schemas:
 *     OnPrint:
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
