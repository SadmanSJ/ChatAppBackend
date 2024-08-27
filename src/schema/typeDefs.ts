import gql from "graphql-tag";

import { MutationTypeDef } from "./mutationSchema";
import { UserTypeDef } from "./userSchema";
import { QueryTypeDef } from "./querySchema";
import { ChatTypeDef } from "./chatSchema";

export const typeDefs = [
  QueryTypeDef,
  MutationTypeDef,
  UserTypeDef,
  ChatTypeDef,
];
