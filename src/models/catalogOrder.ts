import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ISize } from "./attributes/size";
import { IPaperType } from "./attributes/paper/paperType";
import { IPaperColor } from "./attributes/paper/paperColor";
import { ICoverType } from "./attributes/coverType";
import { IBindingType } from "./attributes/BindingType";
import { IOnPrint } from "./attributes/onPrint";
export interface ICatalogOrder {
  title: string;
  size: ISize;
  paper: {
    type: IPaperType;
    number: number;
    color: IPaperColor;
  };
  cover: {
    type: ICoverType;
    filePath?: string;
    color: string;
    bindingFaces: string;
  };
  binding: IBindingType;
  onPrint: IOnPrint;
  calculatePrice?(type: string): Promise<number>;
}
interface ICatalogOrderModel extends Model<ICatalogOrder> {
  calculatePrice(type: string): Promise<number>;
}
const CatalogOrderSchema = new Schema<ICatalogOrder, ICatalogOrderModel>({
  title: { type: String },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  onPrint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OnPrint",
  },
  paper: {
    type: { type: Schema.Types.ObjectId, required: true, ref: "PaperType" },
    color: { type: Schema.Types.ObjectId, required: true, ref: "PaperColor" },
    number: { type: Number, required: true },
  },
  binding: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "BindingType",
  },
  cover: {
    type: { type: Schema.Types.ObjectId, required: true, ref: "CoverType" },
    color: { type: String },
    bindingFaces: {
      type: String,
      values: ["oneFace", "twoFace"],
      required: true,
    },
    filePath: {
      type: String,
    },
  },
});

CatalogOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  // Populate the necessary fields
  const size = this.size.toJSON() as ISize;
  const paperType = this.paper.type.toJSON() as IPaperType;
  const paperColor = this.paper.color.toJSON() as IPaperColor;
  const coverType = this.cover.type.toJSON() as ICoverType;
  const bindingType = this.binding.toJSON() as IBindingType;
  const onPrint = this.onPrint.toJSON() as IOnPrint;

  if (
    size.type != "catalog" ||
    coverType.type != "catalog" ||
    bindingType.type != "catalog" ||
    onPrint.type != "catalog" ||
    coverType.type != "catalog"
  ) {
    throw new Error("invalid attributes");
  }
  const bindingTypeI: number =
    this.cover.bindingFaces == "oneFace"
      ? bindingType.ratioForOne
      : bindingType.ratioForBoth;
  const coverPrice =
    coverType.ratio * onPrint.ratio * bindingTypeI * coverType.ratio;
  const paperNumber = this.paper.number;
  // Your existing logic for calculating price
  const paperPrice = paperType.ratio * paperNumber * paperColor.ratio;
  const catalogPrice =
    (await getConfigValueByKey("CatalogBasePrice")) *
    size.ratio *
    (paperPrice + coverPrice);
  console.log(coverPrice, paperPrice, catalogPrice, paperNumber, catalogPrice);
  return Promise.resolve(catalogPrice * number);
};
const CatalogOrder = model<ICatalogOrder, ICatalogOrderModel>(
  "CatalogOrder",
  CatalogOrderSchema
);
export default CatalogOrder;
