import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_CHAT_API_KEY! as string
);

export default client;
