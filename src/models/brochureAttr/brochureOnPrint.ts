
import { Schema, model } from "mongoose";

export interface IBrochureOnPrint {
    name: string;
    ratio : number;
}
const BrochureOnPrintSchema = new Schema<IBrochureOnPrint>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true},
});
const BrochureOnPrint = model<IBrochureOnPrint>("BrochureOnPrint", BrochureOnPrintSchema);
export default BrochureOnPrint;