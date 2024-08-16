import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { ISize } from "./attributes/size";
import { IOnPrint } from "./attributes/onPrint";
export interface IBox {
  title: string;
  size: ISize;
  material: IMaterial;
  onPrint: IOnPrint;
  type: "bag" | "box";
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IBoxModel extends Model<IBox> {
  calculatePrice(type: string): Promise<number>;
}

const BoxSchema = new Schema<IBox, IBoxModel>({
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
  type: { type: String, required: true, enum: ["bag", "box"] },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

BoxSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const material = this.material.toJSON() as IMaterial;
  const onPrint = this.onPrint.toJSON() as IOnPrint;
  const size = this.size.toJSON() as ISize;
  if (
    material.type! != this.type ||
    onPrint.type != this.type ||
    size.type != this.type
  ) {
    throw new Error("Invalid attributes");
  }
  const CardPrice =
    (await getConfigValueByKey("BoxBasePrice")) *
    material.ratio *
    onPrint.ratio *
    size.ratio;
  return Promise.resolve(CardPrice * number);
};
const Box = model<IBox, IBoxModel>("Box", BoxSchema);
export default Box;
