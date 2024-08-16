import { Schema, model } from "mongoose";

export interface IType {
  name: string;
  ratio: number;
  type : "mug"|"stamp"|"flag" 
}
const TypeSchema = new Schema<IType>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
  type : { type: String, required: true ,enum :["mug","stamp","flag"]}
});
const Type = model<IType>("Type", TypeSchema);
export default Type;
/**
 * @swagger
 * components:
 *   schemas:
 *     Type:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [mug, stamp]
 *       required:
 *         - name
 *         - ratio
 */