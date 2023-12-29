import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ISize } from "./size";
import { IPaperType } from "./paper/paperType";
import { IPaperColor } from "./paper/paperColor";
import { ICoverType } from "./coverType";
import { IBindingType } from "./BindingType";
import { IBrochureOnPrint } from "./brochureAttr/brochureOnPrint";
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

    filePath: string;
  };
  binding: IBindingType;
  onPrint: IBrochureOnPrint;
  calculatePrice?(type: string): Promise<number>;
}
interface ICatalogOrderModel extends Model<ICatalogOrder> {
  calculatePrice(type: string): Promise<number>;
}

const CatalogOrderSchema = new Schema<ICatalogOrder, ICatalogOrderModel>({
  title: { type: String, required: true },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  onPrint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "BrochureOnPrint",
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

    bindingFaces: {
      type: String,
      values: ["oneFace", "twoFace"],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
  },
});

CatalogOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  // Populate the necessary fields
  await this.populate("material", "onPrint", "size").execPopulate();
  const size = this.size.toJSON() as ISize;
  const paperType = this.paper.type.toJSON() as IPaperType;
  const paperColor = this.paper.color.toJSON() as IPaperColor;
  const coverType = this.cover.type.toJSON() as ICoverType;
  const bindingType = this.binding.toJSON() as IBindingType;
  const onPrint = this.onPrint.toJSON() as IBrochureOnPrint;
  const bindingFaceRatio = this.cover.bindingFaces.ratio;
  const bindingTypeI: number =
    this.cover.bindingFaces == "oneFace"
      ? bindingType.ratioForOne
      : bindingType.ratioForBoth;
  const coverPrice =
    coverType.ratio *
    onPrint.ratio *
    bindingFaceRatio *
    bindingTypeI *
    coverType.ratio;
  const paperNumber = this.paper.number;
  // Your existing logic for calculating price
  const paperPrice = paperType.ratio * paperNumber * paperColor.ratio;
  const catalogPrice =
    (await getConfigValueByKey("CatalogBasePrice")) *
    size.ratio *
    (paperPrice + coverPrice);

  return Promise.resolve(catalogPrice * number);
};

const CatalogOrder = model<ICatalogOrder, ICatalogOrderModel>(
  "CatalogOrder",
  CatalogOrderSchema
);
export default CatalogOrder;
