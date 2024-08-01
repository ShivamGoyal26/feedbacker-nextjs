import { Message } from "@/model/User";

export type ApiResponse = {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
};
