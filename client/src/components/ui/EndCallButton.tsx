import axiosInstance from "@/utils/axios";
import { Button } from "@mui/material";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

type EndCallButtonProps = {
  onEndMeeting: () => void; 
  text: string;
};

const EndCallButton:React.FC<EndCallButtonProps> = ({ text, onEndMeeting }) => {
  const call: any = useCall();
  const router = useRouter();

  // Check if the local participant is the owner of the call

  
  console.log("Meeting Owner: ");
  //  console.log("Call: ", call.state.createdBy);

  const handleEndCall = async () => {
    try {
      await call?.endCall();
      const response = await axiosInstance.put(
        `/meeting/end-meeting/${call?.cid}`
      );
      console.log(response);
      onEndMeeting()
    } catch (error) {
      console.error("Error ending the call:", error);
    }
  };

  return (
    <Button
      onClick={handleEndCall}
      className="bg-red-500 text-white hover:bg-red-600"
    >
      {text}
    </Button>
  );
};

export default EndCallButton;
