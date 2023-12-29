import { Schema, model } from "mongoose";
import { IBookOrder } from "./bookOrder";
import { IUser } from "./user";
import { IOtherOrder } from "./otherOrders";

export interface IOrder {
  user: IUser;
  type: IBookOrder | IOtherOrder;
  itemType: "BookOrder" | "OtherOrder";
  media: { path: string }[];
  number: string;
  address: string;
  postCode: number;
  totalPrice: number;
  status: string;
  postPrice: number;
  res_number : string;
  description: string;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User" , required: true},
  type: {
    type: Schema.Types.ObjectId,
    refPath: "itemType",
    required: true,
  },
  itemType: {
    type: String,
    enum: ["BookOrder", "OtherOrder"],required: true,
  },
  media: [
    {
      path: {
        type: String,
      },
    },
  ],
  address: { type: String, required: true },
  postCode: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  postPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "expired", "sent", "sending", "preparing"],
    required: true,
    default: "pending",
  },
  res_number : {type: String, required: true},
  description : {type: String }
});

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
