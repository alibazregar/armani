import { Schema, model } from "mongoose";


export interface IPaperColor {
    name: string;
    ratio : number;
}
const PaperColorSchema = new Schema<IPaperColor>({
    name : {type : String , required : true},
    ratio : {type : Number , required : true}
});
const PaperType = model<IPaperColor>("PaperColor", PaperColorSchema);
export default PaperType;