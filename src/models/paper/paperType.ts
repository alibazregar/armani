import { Schema, model } from "mongoose";

export interface IPaperType {
    name: string;
    ratio : number;
}
const PaperTypeSchema = new Schema<IPaperType>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true}
});
const PaperType = model<IPaperType>("PaperType", PaperTypeSchema);
export default PaperType;
