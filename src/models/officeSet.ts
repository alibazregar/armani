import { Schema, model, Model } from "mongoose";
import { getConfigValueByKey } from "./config";
import { IOnPrint } from "./attributes/onPrint";
import { IMaterial } from "./attributes/material";
export interface IOfficeSetsPaperType<T extends "a4" | "a5"> {
  type: T;
  header: {
    onPrint: IOnPrint;
    number: number;
    material: IMaterial;
  };
  pocket: {
    onPrint: IOnPrint;
    number: number;
    material: IMaterial;
  };
}

export interface IOfficeSet {
  title: string;
  cover : string;
  paperTypes: IOfficeSetsPaperType<"a4" | "a5">[];
  calculatePrice(number: number): Promise<number>;
}
interface IOfficeSetModel extends Model<IOfficeSet> {
  calculatePrice(number: number): Promise<number>;
}

const OfficeSetSchema = new Schema<IOfficeSet, IOfficeSetModel>({
  title: String,
  cover : String,
  paperTypes: [
    {
      type: { type: String, enum: ["a4", "a5"] },
      header: {
        onPrint: {
          type: Schema.Types.ObjectId,
          ref: "OnPrint",
          required: true,
        },
        material: {
          type: Schema.Types.ObjectId,
          ref: "Material",
          required: true,
        },
        number: { type: Number, default: 1, required: true },
      },
      pocket: {
        onPrint: {
          type: Schema.Types.ObjectId,
          ref: "OnPrint",
          required: true,
        },
        material: {
          type: Schema.Types.ObjectId,
          ref: "Material",
          required: true,
        },
        number: Number,
      },
    },
  ],
});

OfficeSetSchema.methods.calculatePrice = async function (
  number: number = 1
): Promise<number> {
  let valuePerNumber = 0;

  const baseHeaderValue = await getConfigValueByKey("baseOfficeSetHeader");
  const basePocketValue = await getConfigValueByKey("baseOfficeSetPocket");
  await Promise.all(
    this.paperTypes.map(async (paperType: any) => {
      //add a4 ,a5 to config
      const paperOfficeRatio = await getConfigValueByKey(
        "paperOfficeRatio" + paperType.type
      );
      if (
        paperType.header.onPrint.type !== "officeSet" ||
        paperType.header.material.type !== "officeSet" ||
        paperType.pocket.onPrint.type !== "officeSet" ||
        paperType.pocket.material.type !== "officeSet"
      ) {
        throw new Error("Invalid attributes");
      }

      valuePerNumber +=
        baseHeaderValue *
        paperType.header.onPrint.ratio *
        paperType.header.material.ratio *
        paperType.header.number *
        paperOfficeRatio;
      valuePerNumber +=
        basePocketValue *
        paperType.pocket.onPrint.ratio *
        paperType.pocket.material.ratio *
        paperType.pocket.number;
      paperOfficeRatio;
    })
  );
  return valuePerNumber * number;
};
const OfficeSet = model<IOfficeSet, IOfficeSetModel>(
  "OfficeSet",
  OfficeSetSchema
);
export default OfficeSet;
