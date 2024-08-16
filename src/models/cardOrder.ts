import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { IOnPrint } from "./attributes/onPrint";
import { ISize } from "./attributes/size";
export interface ICardOrder {
  title: string;
  onPrint: IOnPrint;
  size: ISize;
  type: string;
  material: IMaterial;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface ICardOrderModel extends Model<ICardOrder> {
  calculatePrice(type: string): Promise<number>;
}

const CardOrderSchema = new Schema<ICardOrder, ICardOrderModel>({
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
  type: {
    type: String,
    required: true,
    enum: ["visit", "guaranty", "invite", "discount", "club", "loyal"],
  },
});

CardOrderSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const material = this.material.toJSON() as IMaterial;
  const onPrint = this.onPrint.toJSON() as IOnPrint;
  const size = this.size.toJSON() as ISize;
  if (
    material.type! != "card" ||
    onPrint.type != "card" ||
    size.type != "card"
  ) {
    console.log(material, onPrint, size);
    throw new Error("Invalid attributes");
  }
  const CardPrice =
    (await getConfigValueByKey("CardBasePrice")) *
    material.ratio *
    onPrint.ratio *
    size.ratio;
  return Promise.resolve(CardPrice * number);
};
const CardOrder = model<ICardOrder, ICardOrderModel>(
  "CardOrder",
  CardOrderSchema
);
export default CardOrder;
