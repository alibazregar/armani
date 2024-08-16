import { Schema, model } from "mongoose";
import { IUser } from "./user";

export interface ICart {
  user: IUser;
  cart: {
    product: string;
    itemType:
      | "BookOrder"
      | "BrochureOrder"
      | "CatalogOrder"
      | "PackageOrder"
      | "FlagOrder"
      | "OfficeSet"
      | "MugOrder"
      | "TShirtOrder"
      | "NoteBookOrder"
      | "StampOrder"
      | "BannerOrder"
      | "CardOrder"
      | "StandXOrder"
      | "PopUpStand"
      | "PhotoChassis"
      | "FoamBoardOrder"
      | "Label"
      | "Box";
    media?: { path: string }[];
    description: string;
    number: number;
  }[];
}
[];

const CartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        refPath: "itemType",
        required: true,
      },
      itemType: {
        type: String,
        enum: [
          "BannerOrder",
          "BookOrder",
          "BrochureOrder",
          "CatalogOrder",
          "PackageOrder",
          "FlagOrder",
          "OfficeSet",
          "MugOrder",
          "TShirtOrder",
          "NoteBookOrder",
          "FoamBoardOrder",
          "StandX",
          "StampOrder",
          "CardOrder",
          `PhotoChassis`,
          "PopUpStand",
          "Label",
          "Box",
          "FoamBoard",
          `StandXOrder`,
        ],
        required: true,
      },
      media: [
        {
          path: {
            type: String,
          },
        },
      ],
      description: String,
      number: { type: Number, required: true, min: 1 },
    },
  ],
});

const Cart = model<ICart>("Cart", CartSchema);
export default Cart;
