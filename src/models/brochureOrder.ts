import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IBrochureMaterial } from "./brochureAttr/brochureMaterial";
import { IBrochureOnPrint } from "./brochureAttr/brochureOnPrint";
import { ISize } from "./size";
export interface IBrochureOrder {
  title: string;
  material: IBrochureMaterial;
  onPrint: IBrochureOnPrint;
  size: ISize;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IBrochureOrderModel extends Model<IBrochureOrder> {
  calculatePrice(type: string): Promise<number>;
}

const BrochureOrderSchema = new Schema<IBrochureOrder, IBrochureOrderModel>({
  title: { type: String, required: true },
  material: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "BrochureMaterial",
  },
  onPrint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "BrochureOnPrint",
  },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

BrochureOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  // Populate the necessary fields
  await this.populate("material", "onPrint", "size").execPopulate();

  const material = this.material.toJSON() as IBrochureMaterial;
  const onPrint = this.onPrint.toJSON() as IBrochureOnPrint;
  const size = this.size.toJSON() as ISize;

  // Your existing logic for calculating price
  const brochurePrice =
    (await getConfigValueByKey("BrochureBasePrice")) *
    material.ratio *
    onPrint.ratio *
    size.ratio;

  return Promise.resolve(brochurePrice * number);
};

const BrochureOrder = model<IBrochureOrder, IBrochureOrderModel>(
  "BrochureOrder",
  BrochureOrderSchema
);
export default BrochureOrder;
