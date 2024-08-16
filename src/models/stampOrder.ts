import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IType } from "./attributes/Type";
import { IModel } from "./attributes/Model";
export interface IStampOrder {
  title: string;
  type: IType;
  model: IModel;
  calculatePrice(type: string): Promise<number>;
}
interface IStampOrderModel extends Model<IStampOrder> {
  calculatePrice?(type: string): Promise<number>;
}

const StampOrderSchema = new Schema<IStampOrder, IStampOrderModel>({
  title: { type: String },
  type: { type: Schema.Types.ObjectId, required: true, ref: "Type" },
  model: { type: Schema.Types.ObjectId, required: true, ref: "Model" },
});
StampOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const type = this.type.toJSON() as IType;
  const model = this.model.toJSON() as IModel;
  if (type.type !== "stamp" || model.type !== "stamp") {
    throw new Error("invalid attributes");
  }
  const StampPrice =
    (await getConfigValueByKey("StampBasePrice")) * type.ratio * model.ratio;
  return Promise.resolve(StampPrice * number);
};

const StampOrder = model<IStampOrder, IStampOrderModel>(
  "StampOrder",
  StampOrderSchema
);
export default StampOrder;
