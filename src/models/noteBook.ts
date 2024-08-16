import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { ICoverType } from "./attributes/coverType";
import { ISize } from "./attributes/size";
export interface INoteBookOrder {
  title: string;
  coverType: ICoverType;
  size: ISize;
  pageNumber: number;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface INoteBookOrderModel extends Model<INoteBookOrder> {
  calculatePrice(type: string): Promise<number>;
}
const NoteBookOrderSchema = new Schema<INoteBookOrder, INoteBookOrderModel>({
  title: { type: String },
  coverType: { type: Schema.Types.ObjectId, ref: "CoverType" },
  pageNumber: { type: Number, required: true },
  afterPrintServices: [{ type: String }],
  size: { type: String, required: true },
});

NoteBookOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const coverType = this.coverType.toJSON() as ICoverType;
  if (coverType.type !== "noteBook") {
    throw new Error("invalid attributes");
  }
  const NoteBookPrice =
    (await getConfigValueByKey("NoteBookBasePrice")) * this.pageNumber +
    coverType.ratio;
  return Promise.resolve(NoteBookPrice * number);
};

const NoteBookOrder = model<INoteBookOrder, INoteBookOrderModel>(
  "NoteBookOrder",
  NoteBookOrderSchema
);
export default NoteBookOrder;
