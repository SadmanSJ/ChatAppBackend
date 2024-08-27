import dotenv from "dotenv";

dotenv.config();

export const mongodbUri = `${process.env.MONGODB_URI}`;
export const jwtSecret = `${process.env.JWT_SECRET}`;
export const origin = `${process.env.ORIGIN}`;
export const port = process.env.PORT || 4000;

export const smsUsername = `${process.env.SMS_USERNAME}`;
export const smsPassword = `${process.env.SMS_PASSWORD}`;

export const SubscriptionString = { addNewChat: "addNewChat" };
