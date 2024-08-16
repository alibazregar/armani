import { Schema, model, Model } from "mongoose";
import { ISize } from "./attributes/size";
import { IPaperType } from "./attributes/paper/paperType";
import { IPaperColor } from "./attributes/paper/paperColor";
import { ICoverType } from "./attributes/coverType";
import { IBindingType } from "./attributes/BindingType";
import { getConfigValueByKey } from "./config";
import Size from "./attributes/size";
import PaperType from "./attributes/paper/paperType";
import PaperColor from "./attributes/paper/paperColor";
import CoverType from "./attributes/coverType";
import BindingType from "./attributes/BindingType";
import { ICoverPaper } from "./attributes/coverPaper";
export interface IBookOrder {
  title: string;
  size: ISize;
  paper: {
    type: IPaperType;
    number: number;
    color: IPaperColor;
  };
  cover: {
    paper: ICoverPaper;
    type: ICoverType;
    binding: IBindingType;
    bindingFaces: string;
    filePath: string;
    bindingWay: string;
    bindingLanguage: string;
  };
  calculatePrice?(type: string): Promise<number>;
}

interface IBookOrderModel extends Model<IBookOrder> {
  calculatePrice(type: string): Promise<number>;
}

const BookOrderSchema = new Schema<IBookOrder, IBookOrderModel>({
  title: { type: String },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  paper: {
    type: { type: Schema.Types.ObjectId, required: true, ref: "PaperType" },
    color: { type: Schema.Types.ObjectId, required: true, ref: "PaperColor" },
    number: { type: Number, required: true },
  },
  cover: {
    type: { type: Schema.Types.ObjectId, ref: "CoverType" },
    binding: {
      type: Schema.Types.ObjectId,
      ref: "BindingType",
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: "CoverPaper",
    },
    bindingFaces: {
      type: String,
      values: ["oneFace", "twoFace"],
    },
    filePath: {
      type: String,
    },
    bindingLanguage: { type: String },
    bindingWay: { type: String },
  },
});

BookOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  // Check validity of attributes
  if (
    this.size.type !== "book" ||
    (this.cover.binding.type !== "book" && this.cover.type.type !== "book")
  ) {
    throw new Error("Invalid attributes");
  }
  // Calculate paper price
  const paperPrice = (this.size.ratio *
    this.paper.type.ratio *
    this.paper.color.ratio *
    this.paper.number) as number;
  let bindingFaceRatio;
  if (!this.cover.bindingFaces?.ratio || !this.cover.binding?.ratioForOne) {
    bindingFaceRatio = 1;
  } else {
    bindingFaceRatio =
      this.cover.bindingFaces === "oneFace"
        ? this.cover.binding?.ratioForOne
        : this.cover.binding?.ratioForBoth;
  }
  // Determine binding face ratio
  // Calculate cover price
  let coverPrice;
  if (this.cover.type?.ratio && this.cover.paper?.ratio) {
    coverPrice =
      bindingFaceRatio + this.cover.type?.ratio * this.cover.paper?.ratio;
  } else {
    coverPrice = 0;
  }
  // Calculate total price
  const totalPrice = (paperPrice + coverPrice) * number;
  return totalPrice;
};

const BookOrder = model<IBookOrder, IBookOrderModel>(
  "BookOrder",
  BookOrderSchema
);
export default BookOrder;
