import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IStand } from "./attributes/Stand";
import { ISize } from "./attributes/size";
export interface IBannerOrder {
  title: string;
  size: ISize;
  afterPrintServices: string[];
  stand: IStand;
  calculatePrice(type: string): Promise<number>;
}
interface IBannerOrderModel extends Model<IBannerOrder> {
  calculatePrice(type: string): Promise<number>;
}

const BannerOrderSchema = new Schema<IBannerOrder, IBannerOrderModel>({
  title: { type: String },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  stand: { type: Schema.Types.ObjectId, required: true, ref: "Stand" },
  afterPrintServices: [{ type: String }],
});

BannerOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const size = this.size.toJSON() as ISize;
  const stand = this.stand.toJSON() as IStand;
  if (size.type !== "banner" || stand.type !== "banner") {
    throw new Error("Invalid attributes");
  }
  const BannerPrice =
    (await getConfigValueByKey("BannerBasePrice")) * size.ratio;
  return Promise.resolve(BannerPrice * number + stand.price);
};
const BannerOrder = model<IBannerOrder, IBannerOrderModel>(
  "BannerOrder",
  BannerOrderSchema
);
export default BannerOrder;
