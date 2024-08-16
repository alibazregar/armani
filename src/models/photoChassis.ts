import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IMaterial } from "./attributes/material";
import { ICoverType } from "./attributes/coverType";
import { ISize } from "./attributes/size";
export interface IPhotoChassis {
  title: string;
  coverType: ICoverType;
  size: ISize;
  material: IMaterial;
  afterPrintServices: string[];
  calculatePrice(type: string): Promise<number>;
}
interface IPhotoChassisModel extends Model<IPhotoChassis> {
  calculatePrice(type: string): Promise<number>;
}

const PhotoChassisSchema = new Schema<IPhotoChassis, IPhotoChassisModel>({
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

PhotoChassisSchema.methods.calculatePrice = async function (
  number: number
): Promise<number> {
  console.log(this.material, this.coverType, this.size);
  const material = this.material.toJSON() as IMaterial;
  const coverType = this.coverType.toJSON() as ICoverType;
  const size = this.size.toJSON() as ISize;
  if (
    material.type! != "photoChassis" ||
    coverType.type != "photoChassis" ||
    size.type != "photoChassis"
  ) {
    throw new Error("Invalid attributes");
  }
  const CardPrice =
    (await getConfigValueByKey("photoChassisBasePrice")) *
    material.ratio *
    coverType.ratio *
    size.ratio;
  return Promise.resolve(CardPrice * number);
};
const PhotoChassis = model<IPhotoChassis, IPhotoChassisModel>(
  "PhotoChassis",
  PhotoChassisSchema
);
export default PhotoChassis;
