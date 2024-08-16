import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { ICoverType } from "./attributes/coverType";
import { ISize } from "./attributes/size";
export interface IPopUpStand {
  title: string;
  coverType: ICoverType;
  size: ISize;
  material: IMaterial;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IPopUpStandModel extends Model<IPopUpStand> {
  calculatePrice(type: string): Promise<number>;
}

const PopUpStandSchema = new Schema<IPopUpStand, IPopUpStandModel>({
  title: { type: String },
  material: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Material",
  },
  coverType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CoverType",
  },
  size: { type: Schema.Types.ObjectId, required: true, ref: "Size" },
  afterPrintServices: [{ type: String }],
});

PopUpStandSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  const material = this.material.toJSON() as IMaterial;
  const coverType = this.coverType.toJSON() as ICoverType;
  const size = this.size.toJSON() as ISize;
  if (
    material.type! != "popUpStand" ||
    coverType.type != "popUpStand" ||
    size.type != "popUpStand"
  ) {
    throw new Error("Invalid attributes");
  }
  const CardPrice =
    (await getConfigValueByKey("PopUpStandBasePrice")) *
    material.ratio *
    coverType.ratio *
    size.ratio;
  return Promise.resolve(CardPrice * number);
};
const PopUpStand = model<IPopUpStand, IPopUpStandModel>(
  "PopUpStand",
  PopUpStandSchema
);
export default PopUpStand;
