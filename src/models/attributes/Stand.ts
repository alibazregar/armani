
import { Schema, model } from "mongoose";

export interface IStand {
    name: string;
    price : number;
    type : "flag"|"banner";
}
const StandSchema = new Schema<IStand>({
    name : {type : String , required : true},
    price : {type : Number , required : true},
    type :{type : String , required : true,enum :["flag", "banner"]}
    
});
const Stand = model<IStand>("Stand", StandSchema);
export default Stand;
/**
 * @swagger
 * components:
 *   schemas:
 *     Stand:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [flag, banner]
 *       required:
 *         - name
 *         - price
 */
