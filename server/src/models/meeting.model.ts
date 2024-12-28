import mongoose, { Schema, Document, ObjectId, model } from "mongoose";
import { IUser } from "./user.model";

export interface IMeeting extends Document {
  _id: ObjectId;
  title: string;
  participants: IUser[];
  description?: string;
  scheduledTime: Date;
  duration: number;
  createdBy: Schema.Types.ObjectId;
  status: "scheduled" | "not scheduled" | "completed" | "canceled";
  endTime?: Date;
  host: Schema.Types.ObjectId;
  type: "public" | "private";
  roomId: string; // Unique room ID
  enableSummary: boolean; // To check if the user wants the summary of the meeting
  dialogues: string;
  summary: string;
  fileUrl: string | any;
  fileName: string | any;
  chatChannelId?: string | any; 
  chatCreatedAt?: Date; 
  chatMembers: Schema.Types.ObjectId[] | any;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    participants: [],
    scheduledTime: {
      type: Date,
      default: Date.now(),
    },
    endTime: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "not scheduled", "completed", "canceled"],
      default: "scheduled",
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
    },
    enableSummary: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogues: {
      type: String,
    },
    summary: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String
    },
    chatChannelId: {
      type: String,
      // unique: true, 
    },
    chatCreatedAt: {
      type: Date,
      default: Date.now,
    },
    chatMembers: {
      type: [Schema.Types.ObjectId],
      ref: "User", 
    },
  },
  { timestamps: true }
);

const Meeting = model<IMeeting>("Meeting", MeetingSchema);

export default Meeting;
