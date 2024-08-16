import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { ISize } from "./attributes/size";
import { IOnPrint } from "./attributes/onPrint";
export interface ILabel {
  title: string;
  size: ISize;
  material: IMaterial;
  onPrint: IOnPrint;
  type: "food" | "cd" | "dvd" | "stick";
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface ILabelModel extends Model<ILabel> {
  calculatePrice(type: string): Promise<number>;
}

const LabelSchema = new Schema<ILabel, ILabelModel>({
  title: { type: String },
  material: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Material",
  },
  onPrint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OnPrint",
  },
  type: { type: String, required: true, enum: ["food", "cd", "dvd", "stick"] },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

LabelSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  console.log(this.material, this.onPrint, this.size);
  const material = this.material.toJSON() as IMaterial;
  const onPrint = this.onPrint.toJSON() as IOnPrint;
  const size = this.size.toJSON() as ISize;
  if (
    material.type != this.type ||
    onPrint.type != this.type ||
    size.type != this.type
  ) {
    throw new Error("Invalid attributes");
  }
  const CardPrice =
    (await getConfigValueByKey("LabelBasePrice")) *
    material.ratio *
    onPrint.ratio *
    size.ratio;
  return Promise.resolve(CardPrice * number);
};
const Label = model<ILabel, ILabelModel>("Label", LabelSchema);
export default Label;
