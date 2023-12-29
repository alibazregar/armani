
import { Schema, model } from "mongoose";

export interface IBindingType {
    name: string;
    ratioForOne : number;
    ratioForBoth : number
}
const BindingTypeSchema = new Schema<IBindingType>({
    name : {type : String , required : true},
    ratioForOne : {type : Number , required : true},
    ratioForBoth : {type : Number , required : true}
});
const BindingType = model<IBindingType>("BindingType", BindingTypeSchema);
export default BindingType;