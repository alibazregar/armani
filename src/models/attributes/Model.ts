import { Schema, model } from "mongoose";

export interface IModel {
  name: string;
  ratio: number;
  type : "stamp" | "standX"
}
const ModelSchema = new Schema<IModel>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
  type : {type : String, enum: ["stamp","standX"]}
});
const Model = model<IModel>("Model", ModelSchema);
export default Model;
/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [stamp]
 *       required:
 *         - name
 *         - ratio
 *         - type
 */