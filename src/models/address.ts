import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Address document
export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  receiverName: string;
  receiverPhone: string;
  postcode: string;
  state: string;
  town: string;
  mainAddress: string;
}

// Define the Mongoose schema for the Address document
const AddressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  postcode: { type: String, required: true },
  state: { type: String, required: true },
  town: { type: String, required: true },
  mainAddress: { type: String, required: true }
});

// Define and export the Address model
const Address = mongoose.model<IAddress>('Address', AddressSchema);
export default Address;
