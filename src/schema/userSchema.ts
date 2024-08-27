import gql from "graphql-tag";

export const UserTypeDef = gql`
  type User {
    _id: String
    name: String
    image: String
    email: String
    mobile: String
    password: String
    role: RoleEnum
    otp: String
    otpExpires: Date
    isVerified: Boolean
    friendList: [FriendList]
    chatRoomAccess: [ChatRoomAccess]
  }

  enum RoleEnum {
    User
    Admin
  }

  type FriendList {
    friend: User
    friendSince: Date
    isBlocked: Boolean
  }

  input UserFilter {
    email: String
    mobile: String
    role: String
    isVerified: Boolean
    _id: ID
  }

  input UserInput {
    name: String
    image: String
    email: String
    mobile: String
    password: String
    role: String
    otp: String
    otpExpires: Date
    isVerified: Boolean
    friendList: [FriendListInput]
    chatRoomAccess: [ChatRoomAccessInput]
  }

  input FriendListInput {
    friendID: String
    friendSince: Date
    isBlocked: Boolean
  }

  type ChatRoomAccess {
    chatRoom: ChatRoom
    isBanned: Boolean
    isArchived: Boolean
  }

  input ChatRoomAccessInput {
    chatRoomID: String
    isBanned: Boolean
    isArchived: Boolean
  }
`;
