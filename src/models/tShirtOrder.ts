import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ISize } from "./attributes/size";
import { IStand } from "./attributes/Stand";
import { IMaterial } from "./attributes/material";
export interface ITShirtOrder {
  title: string;
  color: string;
  size: ISize;
  material: IMaterial;
  calculatePrice(type: string): Promise<number>;
}
interface ITShirtOrderModel extends Model<ITShirtOrder> {
  calculatePrice(type: string): Promise<number>;
}

const TShirtOrderSchema = new Schema<ITShirtOrder, ITShirtOrderModel>({
  title: { type: String },
  color: { type: String, required: true },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  material: { type: Schema.Types.ObjectId, required: true, ref: "Material" },
});

TShirtOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const size = this.size.toJSON() as ISize;
  const material = this.material.toJSON() as IMaterial;
  if (size.type != "tShirt") {
    throw new Error("Invalid attributes");
  }
  if (material.type != "tShirt") {
    throw new Error("Invalid attributes");
  }

  const TShirtPrice =
    (await getConfigValueByKey("TShirtBasePrice")) * size.ratio;
  return Promise.resolve(TShirtPrice * number);
};
const TShirtOrder = model<ITShirtOrder, ITShirtOrderModel>(
  "TShirtOrder",
  TShirtOrderSchema
);
export default TShirtOrder;
