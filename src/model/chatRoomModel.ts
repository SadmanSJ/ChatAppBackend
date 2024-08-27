import mongoose from "mongoose";
import { ChatRoomModelIF } from "../interface";

const schema = new mongoose.Schema<ChatRoomModelIF>(
  {
    title: { type: String, trim: true, default: "" },
    type: { type: String, trim: true },
    participants: [String],
    admins: [String],
    chats: [String],
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", schema);

export default ChatRoom;
