import { Schema, model } from "mongoose";

export interface IMessage {
    message : string;
}
const MessageSchema = new Schema<IMessage>({
  message : String,
});
const Message = model<IMessage>("Message", MessageSchema);
export default Message;
