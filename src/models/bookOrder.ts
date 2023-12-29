import { Schema, model, Model } from "mongoose";
import { ISize } from "./size";
import { IPaperType } from "./paper/paperType";
import { IPaperColor } from "./paper/paperColor";
import { ICoverType } from "./coverType";
import { IBindingType } from "./BindingType";
import { getConfigValueByKey } from "./config";

export interface IBookOrder {
  title: string;
  size: ISize;
  paper: {
    type: IPaperType;
    number: number;
    color: IPaperColor;
  };
  cover: {
    type: ICoverType;
    binding: IBindingType;
    bindingFaces: string;
    filePath: string;
  };
  calculatePrice(number: number): Promise<number>;
}

interface IBookOrderModel extends Model<IBookOrder> {
  calculatePrice(type: string): Promise<number>;
}

const BookOrderSchema = new Schema<IBookOrder, IBookOrderModel>({
  title: { type: String, required: true },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  paper: {
    type: { type: Schema.Types.ObjectId, required: true, ref: "PaperType" },
    color: { type: Schema.Types.ObjectId, required: true, ref: "PaperColor" },
    number: { type: Number, required: true },
  },
  cover: {
    type: { type: Schema.Types.ObjectId, required: true, ref: "CoverType" },
    binding: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BindingType",
    },
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

BookOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  // Populate the necessary fields
  await this.populate(
    "size paper.type paper.color cover.type cover.binding"
  ).execPopulate();

  const size = this.size.toJSON() as ISize;
  const paperType = this.paper.type.toJSON() as IPaperType;
  const paperColor = this.paper.color.toJSON() as IPaperColor;
  const coverType = this.cover.type.toJSON() as ICoverType;
  const bindingType = this.cover.binding.toJSON() as IBindingType;

  // Your existing logic for calculating price
  const paperPrice = ((await getConfigValueByKey("PaperBasePrice")) *
    size.ratio *
    paperType.ratio *
    paperColor.ratio *
    this.paper.number) as number;

  const bindingFaceRatio: number =
    this.cover.bindingFaces == "oneFace"
      ? bindingType.ratioForOne
      : bindingType.ratioForBoth;
  const coverPrice =
    (await getConfigValueByKey("coverPrice")) *
    bindingFaceRatio *
    coverType.ratio;

  return Promise.resolve(paperPrice * coverPrice * number);
};

const BookOrder = model<IBookOrder, IBookOrderModel>(
  "BookOrder",
  BookOrderSchema
);
export default BookOrder;
