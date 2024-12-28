import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { Box, Paper } from "@mui/material";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUserContext } from "@/Context/userContext";
import useAuth from "@/hooks/useAuth";
import ProfileInfo from "./Profile";
import { LineChart } from "@/components/specifics/Chart";
import axiosInstance from "@/utils/axios";
import MeetingTypeList from "./MeetingTypeList";

const HomePage: React.FC = () => {
  const { token } = useUserContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [last7DaysDetails, setLast7DaysDetails] = useState<number[]>([]);

  const fetchLast7DaysData = async () => {
    try {
      const res = await axiosInstance.get(
        "/user/get-last-7-days-meetings-details"
      );
      const last7DaysCounts = res.data.data.map((item: any) => item.count);
      setLast7DaysDetails(last7DaysCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1 second
      setLoading(false);
    };
    loadContent();
    fetchLast7DaysData();
  }, []);

  return (
    <div className="lg:ml-[190px] p-3 lg:pl-16 md:pl-28 sm:pl-28">
      <h1 className="font-semibold text-lg mb-4">
        {loading ? (
          <SkeletonTheme baseColor="#313131" highlightColor="#525252">
            <Skeleton width={100} />
          </SkeletonTheme>
        ) : (
          `Hello, ${user?.userName}`
        )}
      </h1>

      {/* Top Bar */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <h1 className="mb-6 text-3xl font-bold">Meetings</h1>
      </Box>

      {/* Profile Info */}
      <ProfileInfo loading={loading} />

      {/* Meeting Types */}
      <MeetingTypeList />

      {/* Last 7 Days Chart */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="mt-12"
      >
        <h1 className="mb-4 text-3xl font-bold">Last 7 Days</h1>
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
          {/* last7DaysDetails to LineChart */}
          <LineChart
            value={last7DaysDetails.length > 0 ? last7DaysDetails : []}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default HomePage;
