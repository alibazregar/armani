
import { Schema, model } from "mongoose";

export interface IBrochureMaterial {
    name: string;
    ratio : number;
}
const BrochureMaterialSchema = new Schema<IBrochureMaterial>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true},
});
const BrochureMaterial = model<IBrochureMaterial>("BrochureMaterial", BrochureMaterialSchema);
export default BrochureMaterial;