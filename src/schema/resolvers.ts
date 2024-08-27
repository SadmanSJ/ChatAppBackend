import { GraphQLScalarType, Kind } from "graphql";
import User from "../model/userModel";

import { pubsub } from "..";

import { Query } from "./queryResolvers";
import { Mutation } from "./mutationResolvers";
import ChatRoom from "../model/chatRoomModel";
import {
  ChatModelIF,
  ChatRoomAccessModelIF,
  ChatRoomModelIF,
} from "../interface";
import Chat from "../model/chatModel";
import { SubscriptionString } from "../secrets";

const all = {
  Query: Query,
  Mutation: Mutation,

  // User: {
  //   async chatRoomAccess(parent: UserModelIF) {
  //     const objectIdArray = parent.chatRoomAccess.map((id) =>
  //       mongoose.Types.ObjectId(id)
  //     );
  //     return ChatRoom.findById({ sourceID: parent.buyingSourceID });
  //   },
  // },

  RoleEnum: {
    User: "user",
    Admin: "admin",
  },

  ChatRoomAccess: {
    async chatRoom(parent: ChatRoomAccessModelIF) {
      return ChatRoom.findById(parent.chatRoomID);
    },
  },

  ChatRoom: {
    async chats(parent: ChatRoomModelIF) {
      return Chat.find({ _id: { $in: parent.chats } });
    },
    async participants(parent: ChatRoomModelIF) {
      return User.find({ _id: { $in: parent.participants } });
    },
  },

  Chat: {
    async chatRoom(parent: ChatModelIF) {
      return ChatRoom.findById(parent.chatRoomID);
    },
    async sentByUser(parent: ChatModelIF) {
      return User.findById(parent.sentByUserID);
    },
  },

  ChatSort: {
    CREATED_DSC: "-createdAt",
  },

  ChatRoomType: {
    PERSONAL: "personal",
    GROUP: "group",
  },

  Subscription: {
    addNewChat: {
      subscribe: () => pubsub.asyncIterator(SubscriptionString.addNewChat),
    },
  },
};

const DateQL = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value: any) {
      return new Date(value); // value from the client
    },
    serialize(value: any) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) as any; // ast value is always in string format
      }
      return null;
    },
  }),
};

export const resolvers = { Date: DateQL, ...all };
