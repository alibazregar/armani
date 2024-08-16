import { Schema, model } from "mongoose";

export interface ICoverType {
  name: string;
  ratio: number;
  type:
    | "book"
    | "brochure"
    | "card"
    | "catalog"
    | "package"
    | "banner"
    | "noteBook"
    | "photoChassis" | "popUpStand"  | "standX"
}
const CoverTypeSchema = new Schema<ICoverType>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
  type: {
    type : String,
    enum: ["book", "brochure", "card", "catalog", "package", "noteBook","photoChassis","popUpStand", "standX"],
  },
});
const CoverType = model<ICoverType>("CoverType", CoverTypeSchema);
export default CoverType;
/**
 * @swagger
 * components:
 *   schemas:
 *     CoverType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [book, brochure, card, catalog, package, banner, noteBook]
 *       required:
 *         - name
 *         - ratio
 *         - type
 */
