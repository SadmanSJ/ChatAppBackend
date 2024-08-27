import gql from "graphql-tag";

export const MutationTypeDef = gql`
  type Mutation {
    addUser(record: UserInput): User
    addChatRoom(record: ChatRoomInput): ChatRoom
    addChat(record: ChatInput): Chat
  }
`;
