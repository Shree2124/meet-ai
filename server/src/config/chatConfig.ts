import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY as string,
  process.env.STREAM_API_SECRET as string
);

export { serverClient };
