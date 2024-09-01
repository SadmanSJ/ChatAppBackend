import gql from "graphql-tag";

export const QueryTypeDef = gql`
  scalar Date
  type Query {
    hello: String
    user(filter: UserFilter): User
    users(filter: UserFilter): [User]
    chatRoom(filter: ChatRoomFilter): ChatRoom
    chatRoomByID(filter: ChatRoomFilter): ChatRoom
    chatRooms(filter: ChatRoomFilter): [ChatRoom]
    chat(filter: ChatFilter): Chat
    chats(filter: ChatFilter, limit: Int): [Chat]
    getPersonalChatRoom(filter: ChatRoomFilter): ChatRoom
  }

  type Subscription {
    addNewChat: Chat
  }
`;
