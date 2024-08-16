import { Schema, Document, model, Types } from 'mongoose';
import { IUser } from './user';
// Define interface for Ticket document
interface TicketDocument extends Document {
  user: IUser;
  title: string;
  description: string;
  response?: Response;
  createdAt: Date;
}

// Define interface for Response
interface Response {
  message: string;
  createdAt: Date;
}

// Define Ticket Schema
const TicketSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  response: {
    message: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define Ticket model
const Ticket = model<TicketDocument>('Ticket', TicketSchema);

export { Ticket, TicketDocument};
