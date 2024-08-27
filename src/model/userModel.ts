import mongoose from "mongoose";
import { UserModelIF } from "../interface";

const UserSchema = new mongoose.Schema<UserModelIF>(
  {
    name: { type: String, trim: true },
    image: { type: String, trim: true },
    email: { type: String, trim: true, index: true },
    mobile: { type: String, trim: true, index: true },
    password: { type: String },
    role: { type: String },
    chatRoomAccess: [
      {
        chatRoomID: { type: String, index: true },
        isBanned: { type: Boolean, default: false },
        isArchived: { type: Boolean, default: false },
      },
    ],
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
