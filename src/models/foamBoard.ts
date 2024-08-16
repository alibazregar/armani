import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ISize } from "./attributes/size";
import { IMaterial } from "./attributes/material";
import { IType } from "./attributes/Type";
export interface IFoamBoardOrder {
  title: string;
  size: ISize;
  material: IMaterial;
  calculatePrice(type: string): Promise<number>;
}
interface IFoamBoardOrderModel extends Model<IFoamBoardOrder> {
  calculatePrice(type: string): Promise<number>;
}

const FoamBoardOrderSchema = new Schema<IFoamBoardOrder, IFoamBoardOrderModel>({
  title: { type: String },
  material: { type: Schema.Types.ObjectId, required: true, ref: "Material" },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
});

FoamBoardOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const size = this.size.toJSON() as ISize;
  const material = this.material.toJSON() as IMaterial;
  if (material.type != "foamBoard" || size.type != "foamBoard") {
    throw new Error("Invalid attributes");
  }
  const foamBoardPrice =
    (await getConfigValueByKey("FoamBoardBasePrice")) *
    size.ratio *
    material.ratio;
  return Promise.resolve(foamBoardPrice * number);
};

const FoamBoardOrder = model<IFoamBoardOrder, IFoamBoardOrderModel>(
  "FoamBoardOrder",
  FoamBoardOrderSchema
);
export default FoamBoardOrder;
