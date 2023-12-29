
import { Schema, model } from "mongoose";

export interface ICoverType {
    name: string;
    ratio : number;
}
const CoverTypeSchema = new Schema<ICoverType>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true}
});
const CoverType = model<ICoverType>("CoverType", CoverTypeSchema);
export default CoverType;