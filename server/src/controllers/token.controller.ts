import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { streamClient } from "../config/getStream";
import { serverClient } from "../config/chatConfig";

const getTokenUser = asyncHandler(async (req: any, res: Response) => {
  console.log("Api Key", process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY);

  const userId = req.query.userId as string;
  console.log(userId);

  const token = streamClient.createToken(userId);
  console.log(token);
  
  res.json({ userId, token });
});

const getTokenGuest = asyncHandler(async (req: any, res: Response) => {
  
  const { guestName, guestId } = req.body;
  console.log(guestName);
  console.log(process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY);

  // const guestId = req.query.guestId as string;
  console.log(guestId);

  const token = streamClient.createToken(guestId);
  res.json({ guestId, guestName, token });
});

const getTokenChat = asyncHandler(async (req: any, res: Response) => {
  console.log(req.body);
  
  const { userId } = req?.body;
  console.log(userId);
  
  const token = serverClient.createToken(userId);
  res.json({ token, userId });
});

export { getTokenUser, getTokenGuest, getTokenChat };
