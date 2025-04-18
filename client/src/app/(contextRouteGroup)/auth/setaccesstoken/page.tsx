'use client';

import { useUserContext } from "@/Context/userContext";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SetAccessToken = () => {
  const { setToken } = useUserContext();  // Only need setToken
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await axiosInstance.get('user/set-access-token');
        console.log("Response: ", response.data.data);
        const accessToken = response.data.data; // Ensure this is the correct path to the token
        setToken(accessToken);
        router.push('/user/dashboard');
      } catch (error) {
        console.error("Failed to fetch access token:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/login'); // Redirect to login or page where users can re-authenticate
        } 
      } finally {
        setLoading(false);
      }
    }

    fetchAccessToken();
  }, [setToken, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white loader-container">
        <h1 className='head fy'>MeetAi</h1>
        <h1 className='head sy'>AI-Powered</h1>
        <h1 className='head ty'>Meeting</h1>
        <h1 className='head ffy'>Platform</h1>
      </div>
    );
  }

  return null;  // This line is necessary to return nothing when not loading
};

export default SetAccessToken;
