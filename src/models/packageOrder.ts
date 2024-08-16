import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IOnPrint } from "./attributes/onPrint";
import { ISize } from "./attributes/size";
export interface IPackageOrder {
  title: string;
  onPrint: IOnPrint;
  size: ISize;
  afterPrintServices: string[];
  calculatePrice?(type: string): Promise<number>;
  getPopulate?(): Promise<IPackageOrder>;
}
interface IPackageOrderModel extends Model<IPackageOrder> {
  calculatePrice?(type: string): Promise<number>;
  getPopulate?(): Promise<IPackageOrder>;
}

const PackageOrderSchema = new Schema<IPackageOrder, IPackageOrderModel>({
  title: { type: String },
  onPrint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OnPrint",
  },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

PackageOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const onPrint = this.onPrint.toJSON() as IOnPrint;
  const size = this.size.toJSON() as ISize;
  if (onPrint.type == "package" || size.type == "package") {
    throw new Error("Invalid attributes");
  }
  const PackagePrice =
    (await getConfigValueByKey("PackageBasePrice")) *
    onPrint.ratio *
    size.ratio;
  return Promise.resolve(PackagePrice * number);
};
PackageOrderSchema.methods.getPopulate =
  async function (): Promise<IPackageOrder> {
    await this.populate("onPrint", "size").execPopulate();
    const onPrint = this.onPrint.toJSON() as IOnPrint;
    const size = this.size.toJSON() as ISize;
    if (onPrint.type == "package" || size.type == "package") {
      throw new Error("Invalid attributes");
    }
    const result: IPackageOrder = {
      title: this.title as string,
      onPrint,
      size,
      afterPrintServices: this.afterPrintServices,
    };
    return result;
  };
const PackageOrder = model<IPackageOrder, IPackageOrderModel>(
  "PackageOrder",
  PackageOrderSchema
);
export default PackageOrder;
