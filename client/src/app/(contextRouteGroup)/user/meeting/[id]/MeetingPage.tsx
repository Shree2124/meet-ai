"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import {
  Call,
  StreamCall,
  StreamTheme,
  StreamVideoClient,
  StreamVideo,
} from "@stream-io/video-react-sdk";

// Styles
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "@/styles/globals.css";

// Components
import MeetingScreen from "./MeetingScreen";
import WaitingRoom from "./WaitingRoom";
import NotParticipantPage from "./NotParticipantPage";

// Utils
import axiosInstance from "@/utils/axios";
import { RootState } from "@/redux/store";



interface MeetingPageProps {
  id: string;
}

export default function MeetingPage({ id }: MeetingPageProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state?.auth);
  
  // State management
  const [call, setCall] = useState<Call | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [meeting, setMeeting] = useState<any>();
  const [meetingDetails, setMeetingDetails] = useState<any | null>();
  const [isMeetingReady, setIsMeetingReady] = useState<boolean>(false);

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axiosInstance.get(`/meeting/get-meeting/default:${id}`);
        
        setMeeting(res.data.data.roomId);
        setMeetingDetails(res.data.data);

        const scheduledTime = new Date(res.data.data?.scheduledTime);
        const now = new Date();

        // Check if the meeting is ready to start
        setIsMeetingReady(now >= scheduledTime);
      } catch (error) {
        console.error("Error fetching meeting:", error);
      }
    };
    
    fetchMeeting();
  }, [id]);

  // Initialize Stream client
  useEffect(() => {
    const initializeClient = async (guestUserId?: string, username?: string) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        if (!apiKey) throw new Error("Stream API key not set");

        // Configure token request based on user type
        const tokenRequestConfig = user
          ? { 
              method: "get", 
              url: `/token/get-token-user?userId=${user._id}` 
            }
          : {
              method: "post",
              url: "/token/get-token-guest",
              data: { 
                guestId: guestUserId, 
                guestName: username 
              },
            };

        const response = await axiosInstance(tokenRequestConfig);

        // Create Stream client
        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: guestUserId || user?._id,
            name: username || user?.userName || user?._id,
          },
          tokenProvider: () => Promise.resolve(response.data.token),
        });

        setClient(streamClient);
      } catch (error) {
        console.error("Error initializing client:", error);
      }
    };

    if (user) {
      initializeClient();
    } else if (username) {
      setIsGuest(true);
      if (meetingDetails?.type !== "private") {
        const guestUserId = `guest_${Date.now()}`;
        initializeClient(guestUserId, username);
      }
    }
  }, [user, username, meetingDetails?.type]);

  // Join meeting handler
  const handleJoinMeeting = async () => {
    if (!client && !user && meetingDetails?.type === "private") {
      return;
    }

    setLoading(true);
    try {
      const call = client!.call("default", id);
      await call.join();
      setCall(call);
      
      // Add participant to meeting
      const participantData = {
        roomId: id,
        userId: user ? user._id : Date.now(),
        userName: user ? user.userName : username,
        avatar: user ? user.avatar : "",
      };

      await axiosInstance.put("/meeting/add-participant", {
        user: participantData,
        roomId: meeting,
      });
    } catch (error) {
      console.error("Error joining meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is a participant in a private meeting
  const isUserParticipant = meetingDetails?.participants.some(
    (participant: any) => participant.userId === user?._id
  );

  // Handle private meeting access
  if ((!isUserParticipant && meetingDetails?.type === "private") || 
      (meetingDetails?.type === "private" && !user)) {
    return <NotParticipantPage />;
  }

  // Show waiting room if meeting hasn't started yet
  if (meetingDetails && !isMeetingReady) {
    return <WaitingRoom meeting={meetingDetails} router={router} />;
  }

  // Show join interface if not in a call
  if (!client || !call) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className= "shadow-md p-8 rounded-lg w-full max-w-md">
          <h2 className="mb-6 font-bold text-2xl text-center">Join Meeting</h2>
          
          {!user && (
            <div className="mb-6">
              <label htmlFor="username" className="block mb-1 font-medium text-gray-700 text-sm">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your name"
                value={username ?? ""}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>
          )}
          
          <button
            onClick={handleJoinMeeting}
            disabled={loading || (!user && !username)}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full text-white disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 animate-spin" size={20} />
                <span>Joining...</span>
              </div>
            ) : (
              "Join Meeting"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Render meeting UI when in a call
  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <MeetingScreen />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}