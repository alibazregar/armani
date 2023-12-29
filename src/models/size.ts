import { Schema, model } from "mongoose";

export interface ISize {
  value: {
    length?: number;
    width?: number;
    height?: number;
  };
  ratio: number;
}

const SizeSchema = new Schema<ISize>({
  value: {
    length: Number,
    width: Number,
  },
  ratio: Number,
});
const Size = model<ISize>("Size", SizeSchema);
export default Size;
