import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  DeviceSettings,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  User,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import AudioVolumeIndicator from "@/components/Meeting/AudioVolumeIndicator"; // Ensure path is correct
import PermissionPrompt from "@/components/Meeting/PermissionPrompt";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axiosInstance from "@/utils/axios";

interface SetupUIProps {
  onSetUpComplete?: () => void;
}

const MeetingSetUp = ({ onSetUpComplete}: SetupUIProps) => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const [micDisabled, setMicDisabled] = useState(false);
  const [camDisabled, setCamDisabled] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // TODO:
  // useEffect(() => {
  //   const initializeClient = async (
  //     guestUserId?: string,
  //     username?: string
  //   ) => {
  //     try {
  //       const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!;
  //       if (!apiKey) throw new Error("Stream API key not set");

  //       const tokenRequestConfig = {
  //         method: "post",
  //         url: "/token/get-token-guest",
  //         data: { guestId: guestUserId, guestName: username },
  //       };

  //       const response = await axiosInstance(tokenRequestConfig);

  //       console.log(response.data);

  //       const streamClient = new StreamVideoClient({
  //         apiKey,
  //         user: {
  //           id: guestUserId!,
  //           name: username!,
  //           type: "guest",
  //         },
  //         tokenProvider: () => Promise.resolve(response.data.token),
  //       });

  //       setClient(streamClient);
  //     } catch (error) {
  //       console.error("Error initializing client:", error);
  //     }
  //   };

  //   if (username && !user) {
  //     const guestUserId = `guest_${Date.now()}`;
  //     initializeClient(guestUserId, username);
  //   }
  // }, [username]);

  useEffect(() => {
    const manageDevices = async () => {
      if (call) {
        try {
          // Manage microphone
          if (micDisabled) {
            await call.microphone.disable();
          } else {
            await call.microphone.enable();
          }

          // Manage camera
          if (camDisabled) {
            await call.camera.disable();
          } else {
            await call.camera.enable();
          }
        } catch (error) {
          console.error("Error managing devices: ", error);
        }
      }
    };

    manageDevices();
  }, [micDisabled, camDisabled, call]);

  const micState = useMicrophoneState();
  const camState = useCameraState();

  // Check if microphone or camera permissions are missing
  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">SetUp</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-3">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>
{/* 
      {
        !user && (
          <input
            className="bg-transparent text-white"
            placeholder="Enter your name"
            required={true}
          ></input>
        )
      } */}

      {/* Checkbox to disable/enable microphone */}
      <label className="flex items-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={micDisabled}
          onChange={(e) => setMicDisabled(e.target.checked)}
        />
        Join with microphone off
      </label>

      {/* Checkbox to disable/enable camera */}
      <label className="flex items-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={camDisabled}
          onChange={(e) => setCamDisabled(e.target.checked)}
        />
        Join with camera off
      </label>
      <Button onClick={onSetUpComplete}>Join Meeting</Button>
    </div>
  );
};

export default MeetingSetUp;
