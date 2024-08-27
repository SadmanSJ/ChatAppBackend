// export enum RoleEnum {}

// User registration
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  roleID?: string;
}

// User login
// ~~
export interface LoginUser {
  email: string;
  password: string;
}

// User
// ~~

// ~~
export interface UserModelIF {
  _id: string;
  image: string;
  name: string;
  email?: string;
  mobile?: string;
  password: string;
  role: "user" | "admin";
  otp: string | undefined;
  otpExpires: number | undefined;
  isVerified: boolean;
  friendList: FriendList[];
  chatRoomAccess: ChatRoomAccessModelIF[];
}

interface FriendList {
  friendID: string;
  friendSince: Date;
  isBlocked: boolean;
}

export interface ChatRoomAccessModelIF {
  chatRoomID: string;
  isBanned: boolean;
  isArchived: boolean;
}

export interface ChatRoomModelIF {
  participants: string[];
  type: "personal" | "group";
  title: string;
  admins: string[];
  chats: string[];
}

export interface ChatModelIF {
  sentByUserID: string;
  chatRoomID: string;
  message: MessageModelIF;
  isUnsent: boolean;
}

export interface MessageModelIF {
  attachment: string;
  text: string;
}
