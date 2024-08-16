import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IType } from "./attributes/Type";
export interface IMugOrder {
  title: string;
  type: IType;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IMugOrderModel extends Model<IMugOrder> {
  calculatePrice(type: string): Promise<number>;
}

const MugOrderSchema = new Schema<IMugOrder, IMugOrderModel>({
  title: { type: String },
  type: { type: Schema.Types.ObjectId, required: true, ref: "Type" },
  afterPrintServices: [{ type: String }],
});

MugOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const type = this.type.toJSON() as IType;
  if (type.type !== "mug") {
    throw new Error("invalid attributes");
  }
  const MugPrice = (await getConfigValueByKey("MugBasePrice")) * type.ratio;
  return Promise.resolve(MugPrice * number);
};
const MugOrder = model<IMugOrder, IMugOrderModel>("MugOrder", MugOrderSchema);
export default MugOrder;
