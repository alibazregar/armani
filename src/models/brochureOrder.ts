import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { IOnPrint } from "./attributes/onPrint";
import { ISize } from "./attributes/size";
export interface IBrochureOrder {
  title: string;
  material: IMaterial;
  onPrint: IOnPrint;
  size: ISize;
  afterPrintServices: string[];
  calculatePrice?(type: string): Promise<number>;
  getPopulate?(): Promise<IBrochureOrder>;
}
interface IBrochureOrderModel extends Model<IBrochureOrder> {
  calculatePrice(type: string): Promise<number>;
  getPopulate?(): Promise<IBrochureOrder>;
}

const BrochureOrderSchema = new Schema<IBrochureOrder, IBrochureOrderModel>({
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
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

BrochureOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const material = this.material.toJSON() as IMaterial;
  const onPrint = this.onPrint.toJSON() as IOnPrint;
  const size = this.size.toJSON() as ISize;
  if (
    material.type !== "brochure" ||
    onPrint.type !== "brochure" ||
    size.type !== "brochure"
  ) {
    throw new Error("invalid types");
  }
  const brochurePrice =
    (await getConfigValueByKey("BrochureBasePrice")) *
    material.ratio *
    onPrint.ratio *
    size.ratio;

  return Promise.resolve(brochurePrice * number);
};
BrochureOrderSchema.methods.getPopulate =
  async function (): Promise<IBrochureOrder> {
    // Populate the necessary fields
    await this.populate("material", "onPrint", "size").execPopulate();
    const material = this.material.toJSON() as IMaterial;
    const onPrint = this.onPrint.toJSON() as IOnPrint;
    const size = this.size.toJSON() as ISize;
    if (
      material.type !== "brochure" ||
      onPrint.type !== "brochure" ||
      size.type !== "brochure"
    ) {
      throw new Error("invalid types");
    }
    const result: IBrochureOrder = {
      title: this.title as string,
      size: size,
      material: material,
      onPrint: onPrint,
      afterPrintServices: this.afterPrintServices,
    };
    return result;
  };
const BrochureOrder = model<IBrochureOrder, IBrochureOrderModel>(
  "BrochureOrder",
  BrochureOrderSchema
);
export default BrochureOrder;
