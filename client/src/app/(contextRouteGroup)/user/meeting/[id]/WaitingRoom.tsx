"use client";;
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { Button, Box, Typography } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface WaitingRoomProps {
  meeting: any;
  router: AppRouterInstance;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ meeting, router }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [meetingReady, setMeetingReady] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<any>(meeting);

  useEffect(() => {
    const scheduledDate = dayjs(meetingDetails?.scheduledTime);

    const updateTimer = () => {
      const now = dayjs();
      const diff = scheduledDate.diff(now);

      if (diff <= 0) {
        setMeetingReady(true);
        setTimeRemaining("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [meetingDetails?.scheduledTime]);

  const handleJoinMeeting = () => {
    window.location.reload()
    console.log("Button pressed ",meeting?.roomId.split(":").pop());
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center ">
      <Box
        sx={{
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "white",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          Scheduled Meeting Waiting Room
        </Typography>

        {meetingReady ? (
          <Button
            onClick={handleJoinMeeting}
            variant="contained"
            sx={{
              px: 6,
              py: 2,
              fontSize: "18px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #4caf50, #2e7d32)",
              color: "white",
              borderRadius: "50px",
              "&:hover": {
                background: "linear-gradient(90deg, #2e7d32, #4caf50)",
              },
              transition: "all 0.3s ease",
              boxShadow: "0px 4px 10px rgba(0, 255, 0, 0.2)",
            }}
          >
            Join Meeting
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: "white",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              Meeting starts in:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff6f61, #ff3d00)",
                boxShadow: "0px 8px 15px rgba(255, 0, 0, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                  textAlign: "center",
                }}
              >
                {timeRemaining}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WaitingRoom;
