import { Schema, model } from "mongoose";
import { IUser } from "./user";
import { IAddress } from "./address";

export interface IOrder {
  user: IUser;
  products: Record<string, any>;
  address: IAddress;
  postType: "normal" | "pishtaz" | "peyk" | "nothing";
  totalPrice: number;
  status: string;
  postPrice: number;
  res_number: string;
  description: string;
  trackingId: number;
  createdAt: Date; // Added createdAt field
  updatedAt: Date; // Added updatedAt field
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: Schema.Types.Mixed,
        status: {
          type: String,
          enum: ["preparing", "new", "sent", "sending","rejected"],
          default: "new",
          required: true,
        },
      },
    ],
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    postType: {
      type: String,
      enum: ["normal", "pishtaz", "peyk", "nothing"],
      required: true,
    },
    totalPrice: { type: Number, required: true },
    postPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid","expired"],
      required: true,
      default: "pending",
    },
    res_number: { type: String, required: true },
    description: { type: String },
    trackingId: { type: Number, unique: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);
const Order = model<IOrder>("Order", OrderSchema);
export default Order;
