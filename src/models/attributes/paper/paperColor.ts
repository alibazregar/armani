import { Schema, model } from "mongoose";

export interface IPaperColor {
  name: string;
  ratio: number;
}
const PaperColorSchema = new Schema<IPaperColor>({
  name: { type: String, required: true },
  ratio: { type: Number, required: true },
});
const PaperColor = model<IPaperColor>("PaperColor", PaperColorSchema);
export default PaperColor;
/**
 * @swagger
 * components:
 *   schemas:
 *     PaperColor:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *       required:
 *         - name
 *         - ratio
 */
