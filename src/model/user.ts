import { Schema, model } from "mongoose";

export interface IUser {
  firstName?: string;
  lastName?: string;
  phone: number;
  email?: string;
  loginAttempts:number;
  lastLoginAttempt?: Date|null;
}
const userSchema = new Schema<IUser>({
  firstName: String,
  lastName: String,
  phone: { type: Number, required: true, maxLength: 10, minLength: 11 },
  email: { type: String },
  loginAttempts: { type: Number, default: 0 },
  lastLoginAttempt: { type: Date, default: null },
});
const User = model<IUser>("User", userSchema);
export default User;
