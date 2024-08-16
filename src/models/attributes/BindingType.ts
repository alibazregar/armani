
import { Schema, model } from "mongoose";

export interface IBindingType {
    name: string;
    ratioForOne : number;
    ratioForBoth : number;
    type : "book" | "brochure" | "card" | "catalog"| "package" | "banner"
}
const BindingTypeSchema = new Schema<IBindingType>({
    name : {type : String , required : true},
    ratioForOne : {type : Number , required : true},
    ratioForBoth : {type : Number , required : true},
    type : { type : String ,enum :["book" , "brochure" ,"card" , "catalog","package","banner"] }
});
const BindingType = model<IBindingType>("BindingType", BindingTypeSchema);
export default BindingType;
/**
 * @swagger
 * components:
 *   schemas:
 *     BindingType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         ratioForOne:
 *           type: number
 *         ratioForBoth:
 *           type: number
 *         type:
 *           type: string
 *           enum: [book, brochure, card, catalog, package, banner]
 *       required:
 *         - name
 *         - ratioForOne
 *         - ratioForBoth
 *         - type
 */