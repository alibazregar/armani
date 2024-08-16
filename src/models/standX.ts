import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ICoverType } from "./attributes/coverType";
import { IModel } from "./attributes/Model";
export interface IStandXOrder {
  title: string;
  coverType: ICoverType;
  model: IModel;
  calculatePrice(type: string): Promise<number>;
}
interface IStandXOrderModel extends Model<IStandXOrder> {
  calculatePrice(type: string): Promise<number>;
}

const StandXOrderSchema = new Schema<IStandXOrder, IStandXOrderModel>({
  title: { type: String },
  model: { type: Schema.Types.ObjectId, required: true, ref: "Model" },
  coverType: { type: Schema.Types.ObjectId, required: true, ref: "CoverType" },
});

StandXOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const coverType = this.coverType.toJSON() as ICoverType;
  const model = this.model.toJSON() as IModel;
  if (coverType.type != "standX" || model.type != "standX") {
    throw new Error("Invalid attributes");
  }
  const StandXPrice =
    (await getConfigValueByKey("StandXBasePrice")) +
    model.ratio * coverType.ratio;
  return Promise.resolve(StandXPrice * number);
};

const StandXOrder = model<IStandXOrder, IStandXOrderModel>(
  "StandXOrder",
  StandXOrderSchema
);
export default StandXOrder;
