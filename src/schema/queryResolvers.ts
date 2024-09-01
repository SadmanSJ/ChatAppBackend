import { Types } from "mongoose";

import User from "../model/userModel";
import ChatRoom from "../model/chatRoomModel";
import Chat from "../model/chatModel";

export const Query = {
  async user(parent: any, args: any, context: any, info: any) {
    return User.findOne({ ...args.filter });
  },

  async users(parent: any, args: any, context: any, info: any) {
    return User.find({ ...args.filter });
  },

  async chatRoomByID(parent: any, args: any, context: any, info: any) {
    return ChatRoom.findById(args.filter._id);
  },

  async chatRoom(parent: any, args: any, context: any, info: any) {
    return ChatRoom.findOne({ participants: args.filter.participant });
  },
  async chatRooms(parent: any, args: any, context: any, info: any) {
    return ChatRoom.find({ participants: args.filter.participant });
  },
  async chat(parent: any, args: any, context: any, info: any) {
    return Chat.findOne({ ...args.filter });
  },
  async chats(parent: any, args: any, context: any, info: any) {
    return Chat.find({ ...args.filter }).limit(args.limit);
  },

  async getPersonalChatRoom(parent: any, args: any, context: any, info: any) {
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: args.filter.participants },
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: args.filter.participants,
        type: "personal",
      });

      await chatRoom.save();
    }

    return chatRoom;
  },
};
