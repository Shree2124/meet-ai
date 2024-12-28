import React, { useEffect, useState } from "react";
import MeetingCard from "../meetingCard";
import { UpcomingMeet } from "@/constants/UpcomingMeet";
import { Box, Paper } from "@mui/material";
import CardSkeleton from "../Homepage/CardSkeleton";
import axiosInstance from "@/utils/axios";
import { BarChart } from "@/components/specifics/Chart";
import { useRouter } from "next/navigation";
   
const Upcoming = () => {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any>(null);
  const [todays, setTodays] = useState<any>(null);
  const [next7DaysDetails, setNext7DaysDetails] = useState<any>([]);

  const router = useRouter()
  const fetchUpcomingMeetings = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get("/user/get-scheduled-meetings");
      console.log(res.data.data);
      setUpcoming(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNext7DaysMeetingDetails = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get(
        "/user/get-next-7-days-meetings-details"
      );
      const next7DaysDetails2 = res.data?.data?.map((i: any) => i.count);
      console.log(next7DaysDetails2);
      setNext7DaysDetails(next7DaysDetails2);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysSchedule = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get("/user/get-todays-schedule");
      setTodays(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1 second
      setLoading(false);
    };

    loadContent();
    fetchUpcomingMeetings();
    fetchNext7DaysMeetingDetails();
    fetchTodaysSchedule();
  }, []);
  
  return (
    <div>
      <Box
        id="upcoming"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="mt-12"
      >
        <h1 className="mb-4 text-3xl font-bold">Next 7 Days Schedule</h1>
      </Box>

      <Box>
        <Paper
          elevation={3}
          sx={{
            bgcolor: "transparent",
            padding: "1rem",
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "relative",
            maxWidth: "45rem",
            height: "25rem",
            margin: "0 !important",
          }}
        >
          {/* next7DaysDetails to LineChart */}
          <BarChart
            value={next7DaysDetails.length > 0 ? next7DaysDetails : []}
          />
        </Paper>
      </Box>

      <Box
        id="upcoming"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="mt-12"
      >
        <h1 className="mb-4 text-3xl font-bold">Today</h1>
      </Box>
      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : todays?.map((meeting: any, index: any) => (
              <Box
                key={index}
                mb="20px"
                p="10px"
                className="h-full bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between"
              >
                <MeetingCard
                  title={meeting.title}
                  buttonText="Join Meet"
                  handleClick={() => {
                    router.replace(`/user/meeting/${meeting?.roomId.split(":").pop()}`);
                  }}
                  
                  type={meeting.type}
                  roomId={meeting.roomId}
                  description={meeting.description}
                  participants={meeting.participants}
                  scheduledTime={meeting.scheduledTime}
                />
              </Box>
            ))}
      </Box>

      {/* Upcoming Meetings */}
      <Box
        id="upcoming"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="mt-12"
      >
        <h1 className="mb-4 text-3xl font-bold">Upcoming</h1>
      </Box>

      <Box
        mt="25px"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {loading
  ? Array.from({ length: 4 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))
  : (() => {
      // Filter out past meetings
      const upcomingMeetings = upcoming?.filter((meeting: any) => {
        const isPastMeeting = new Date(meeting?.scheduledTime) < new Date();
        return !isPastMeeting;
      }) || [];

      // Check if there are any upcoming meetings
      if (upcomingMeetings.length === 0) {
        return (
          <Box
          mb="20px"
          p="10px"
          className="h-full bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between"
        >
          <p className="text-center text-white mt-6 text-xl" >No upcoming meetings</p>
          </Box>
        );
      }

      return upcomingMeetings.map((meeting: any, index: any) => (
        <Box
          key={index}
          mb="20px"
          p="10px"
          className="h-full bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between"
        >
          <MeetingCard
            title={meeting.title}
            buttonText="Join Meet"
            handleClick={() => {}}
            type={meeting.type}
            roomId={meeting.roomId}
            description={meeting.description}
            participants={meeting.participants}
            scheduledTime={meeting.scheduledTime}
          />
        </Box>
      ));
    })()}

      </Box>
    </div>
  );
};

export default Upcoming;
