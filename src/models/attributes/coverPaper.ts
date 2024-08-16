import { Schema, model } from "mongoose";

export interface ICoverPaper {
  name: string;
  ratio: number;
  type:
    | "book"
    | "brochure"
    | "card"
    | "catalog"
    | "package"
    | "banner"
    | "noteBook";
}
const CoverPaperSchema = new Schema<ICoverPaper>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
  type: {
    type : String,
    enum: ["book", "brochure", "card", "catalog", "package", "noteBook"],
  },
});
const CoverPaper = model<ICoverPaper>("CoverPaper", CoverPaperSchema);
export default CoverPaper;
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
