import { Schema, model } from "mongoose";

export interface IPaperType {
    name: string;
    ratio : number;
    type : "book" | "brochure" | "card" | "catalog"| "package" | "banner"
}
const PaperTypeSchema = new Schema<IPaperType>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true},
    type : {type : String,enum :["book" , "brochure" ,"card" , "catalog","package"] }
});
const PaperType = model<IPaperType>("PaperType", PaperTypeSchema);
export default PaperType;
/**
 * @swagger
 * components:
 *   schemas:
 *     PaperType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratio:
 *           type: number
 *         type:
 *           type: string
 *           enum: [book, brochure, card, catalog, package, banner]
 *       required:
 *         - name
 *         - ratio
 *         - type
 */
