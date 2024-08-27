import mongoose from "mongoose";
import { ChatModelIF } from "../interface";

const schema = new mongoose.Schema<ChatModelIF>(
  {
    sentByUserID: { type: String, index: true },
    chatRoomID: { type: String, index: true },
    message: { text: { type: String }, attachment: { type: String } },
  },
  { timestamps: true }
);

schema.index({ sentByUserID: 1, chatRoomID: 1 });

const Chat = mongoose.model("Chat", schema);

export default Chat;
