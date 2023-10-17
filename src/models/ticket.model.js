import { Schema, model, Types} from "mongoose";

let collection = 'tickets'
const ticketSchema = new Schema({
  id: Number,
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
    ref: "user",
  },
});

const ticketModel = model(collection, ticketSchema);

export default ticketModel;
