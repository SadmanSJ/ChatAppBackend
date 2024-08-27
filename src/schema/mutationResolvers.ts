import { pubsub } from "..";
import User from "../model/userModel";
import { ChatModelIF, ChatRoomModelIF, UserModelIF } from "../interface";

import mongoose from "mongoose";
import ChatRoom from "../model/chatRoomModel";
import Chat from "../model/chatModel";
import { SubscriptionString } from "../secrets";

export const Mutation = {
  async addUser(parent: any, args: any, context: any, info: any) {
    let user = await User.findOne({ email: args.record.email });

    if (user) throw new Error("User Exist");

    user = new User({
      ...args.record,
    });

    return await user.save();
  },

  async addChatRoom(
    parent: ChatRoomModelIF,
    args: any,
    context: any,
    info: any
  ) {
    let chatRoom = new ChatRoom({
      ...args.record,
    });
    return await chatRoom.save();
  },

  async addChat(parent: ChatModelIF, args: any, context: any, info: any) {
    const { chatRoomID, sentByUserID, message } = args.record;
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(args.record);
    try {
      let chatRoom = await ChatRoom.findById(chatRoomID);
      let user = await User.findById(sentByUserID);

      if (!chatRoom) return new Error("ChatRoom Not found");
      if (!user) return new Error("User Not found");

      // if (!chatRoomID || !chatRoom) {
      //   let chatRoom = new ChatRoom({
      //     createdByID: sentByUserID,
      //   });

      // user.chatRoomAccess.push({
      //   chatRoomID: chatRoom._id.toString(),
      //   isBanned: false,
      //   isArchived: false,
      // });

      // await user.save({ session });

      let chat = new Chat({
        chatRoomID: chatRoom._id.toString(),
        message,
        sentByUserID,
      });

      // let chatRoomAccess = user.chatRoomAccess.find(
      //   (f) => f.chatRoomID === chatRoomID
      // );

      // console.log("-->", chatRoomID, chatRoomAccess, user.mobile);

      // if (!chatRoomAccess) {
      //   console.log("Md Adding access");
      //   user.chatRoomAccess.push({
      //     chatRoomID: chatRoom._id.toString(),
      //     isBanned: false,
      //     isArchived: false,
      //   });

      //   await user.save({ session });
      // }

      chatRoom.chats.push(chat._id.toString());

      await chatRoom.save({ session });

      await chat.save({ session });
      await session.commitTransaction();

      console.log(chat);
      pubsub.publish(SubscriptionString.addNewChat, { addNewChat: chat });

      return chat;
    } catch (error) {
      session.abortTransaction();
      return error;
    } finally {
      session.endSession();
    }
  },
};
