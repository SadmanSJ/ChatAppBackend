import gql from "graphql-tag";

export const ChatTypeDef = gql`
  type Chat {
    _id: ID
    sentByUser: User
    chatRoom: ChatRoom
    message: Message
    isUnsent: Boolean
    createdAt: Date
  }

  type Message {
    attachment: String
    text: String
  }

  input ChatFilter {
    _id: ID
    sentByUserID: ID
    chatRoomID: ID
  }

  enum ChatSort {
    CREATED_DSC
  }

  enum ChatRoomType {
    PERSONAL
    GROUP
  }

  input ChatInput {
    sentByUserID: ID
    chatRoomID: ID
    message: MessageInput
    isUnsent: Boolean
  }

  input MessageInput {
    attachment: String
    text: String
  }

  type ChatRoom {
    _id: ID
    title: String
    type: ChatRoomType
    chats: [Chat]
    participants: [User]
    admins: [User]
    createdAt: Date
  }

  input ChatRoomInput {
    title: String
    type: ChatRoomType
    chats: [ID]
    participants: [ID]
    admins: [ID]
  }

  input ChatRoomFilter {
    _id: ID
    title: String
    createdByID: String
    participants: [ID]
    participant: ID
    type: ChatRoomType
  }
`;
