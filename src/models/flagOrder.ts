import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ISize } from "./attributes/size";
import Stand, { IStand } from "./attributes/Stand";
import { IMaterial } from "./attributes/material";
import { IType } from "./attributes/Type";
export interface IFlagOrder {
  title: string;
  stand: IStand;
  material: IMaterial;
  type: IType;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IFlagOrderModel extends Model<IFlagOrder> {
  calculatePrice(type: string): Promise<number>;
}

const FlagOrderSchema = new Schema<IFlagOrder, IFlagOrderModel>({
  title: { type: String },
  stand: { type: Schema.Types.ObjectId, required: true, ref: "Stand" },
  material: { type: Schema.Types.ObjectId, required: true, ref: "Material" },
  type: { type: Schema.Types.ObjectId, required: true, ref: "Type" },
  afterPrintServices: [{ type: String }],
});

FlagOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const stand = this.stand.toJSON() as IStand;
  const material = this.material.toJSON() as IMaterial;
  const type = this.type.toJSON() as IType;
  if (material.type != "flag" || stand.type != "flag" || type.type != "flag") {
    throw new Error("Invalid attributes");
  }
  const FlagPrice =
    (await getConfigValueByKey("FlagBasePrice")) * type.ratio * material.ratio;
  return Promise.resolve(FlagPrice * number + stand.price);
};

const FlagOrder = model<IFlagOrder, IFlagOrderModel>(
  "FlagOrder",
  FlagOrderSchema
);
export default FlagOrder;
