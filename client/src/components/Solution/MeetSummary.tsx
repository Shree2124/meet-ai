"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import AvatarCard from "../User/Avatar/AvatarCard";
import DocumentPreview from "./FilePreview";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useState, useRef, FormEvent } from "react";
import moment from "moment";
import { CircleArrowLeftIcon, LoaderCircle, Send, Download, File, MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define proper types
interface Participant {
  userName: string;
  role: string;
  avatar?: string;
}

interface ParticipantAvatar {
  name: string;
  avatar: string;
}

interface Message {
  text: string;
  sender: "user" | "assistant";
}

interface Meeting {
  roomId: string;
  title: string;
  description: string;
  scheduledTime: string;
  hostDetails: {
    userName: string;
  };
  participants: Participant[];
  enableSummary: boolean;
  fileUrl?: string;
  fileName?: string;
}

interface ApiResponse {
  statusCode: number;
  data: {
    answer: string;
    question: string;
  };
  message: string;
  success: boolean;
}

const MeetingSummary = ({ id }: { id: string }) => {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<ParticipantAvatar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const fetchDetails = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.get(`/meeting/get-meeting/${id}`);
      const meetingData = response.data.data;
      setMeeting(meetingData);
    } catch (err) {
      console.error("Error fetching meeting details:", err);
      setError("Failed to load meeting details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/user/dashboard/history");
  };

  const handleGenerateSummary = async () => {
    if (!meeting?.roomId) return;
    
    try {
      setError(null);
      setGenerateLoading(true);
      const res = await axiosInstance.post(
        `/summary/summary-file/${meeting.roomId}`,
        { type: "pdf" }
      );
      setMeeting(res.data.data);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again later.");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: Message = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post<ApiResponse>(`/summary/get-answer/${meeting?.roomId}`, {
        question: currentInput,
      });
      
      if (response.data.success && response.data.data.answer) {
        const assistantMessage: Message = { 
          text: response.data.data.answer, 
          sender: "assistant" 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = { 
          text: "Sorry, I couldn't find an answer to that question.", 
          sender: "assistant" 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error("Error getting answer:", err);
      const errorMessage: Message = { 
        text: "Sorry, there was an error processing your question. Please try again.", 
        sender: "assistant" 
      };
      setMessages(prev => [...prev, errorMessage]);
      setError("Failed to get response. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  useEffect(() => {
    if (meeting) {
      const participantAvatars = meeting.participants
        ?.filter((participant) => participant.role === "participant")
        .map((participant) => ({
          name: participant.userName,
          avatar: participant.avatar || "https://www.w3schools.com/howto/img_avatar.png",
        }));
      setParticipants(participantAvatars || []);
    }
  }, [meeting]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col bg-gray-900 w-full min-h-screen text-gray-300">
      {/* Header Section */}
      <div className="top-0 z-30 sticky flex items-center bg-gray-900 p-3 sm:p-4 border-gray-800 border-b">
        <IconButton 
          onClick={handleBack} 
          sx={{ 
            color: "#3b82f6", 
            cursor: "pointer", 
            marginRight: { xs: "0.5rem", sm: "1rem" } 
          }}
        >
          <CircleArrowLeftIcon height={"1.5rem"} width={"1.5rem"} />
        </IconButton>
        <h1 className="font-bold text-white text-lg sm:text-xl md:text-2xl truncate">Meeting Summary</h1>
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-900 p-2 text-white text-sm sm:text-base text-center">
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {loading && !meeting && (
        <div className="flex flex-1 justify-center items-center p-6">
          <div className="text-center">
            <LoaderCircle className="mx-auto mb-4 text-blue-500 animate-spin" size={40} />
            <Typography className="text-gray-400">Loading meeting details...</Typography>
          </div>
        </div>
      )}
      
      {/* Main Content Area - Full Width */}
      {meeting && (
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            {/* Meeting Details Section */}
            <Box 
              sx={{ 
                bgcolor: "#1f2937", 
                borderRadius: "0.75rem", 
                padding: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, 
                mb: { xs: 2, sm: 3, md: 4 },
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <Typography variant="h5" className="mb-3 md:mb-4 font-bold text-white text-lg sm:text-xl md:text-2xl">
                Meeting Details
              </Typography>
              
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="mb-2">
                    <Typography className="font-bold text-blue-300 text-sm sm:text-base">Title</Typography>
                    <Typography className="text-white text-sm sm:text-base">{meeting.title || 'N/A'}</Typography>
                  </div>
                  
                  <div className="mb-2">
                    <Typography className="font-bold text-blue-300 text-sm sm:text-base">Description</Typography>
                    <Typography className="text-white text-sm sm:text-base line-clamp-3">{meeting.description || 'N/A'}</Typography>
                  </div>
                  
                  <div className="mb-2">
                    <Typography className="font-bold text-blue-300 text-sm sm:text-base">Date</Typography>
                    <Typography className="text-white text-sm sm:text-base">
                      {meeting.scheduledTime ? moment(meeting.scheduledTime).format("MMMM Do YYYY, h:mm a") : 'N/A'}
                    </Typography>
                  </div>
                  
                  <div className="mb-2">
                    <Typography className="font-bold text-blue-300 text-sm sm:text-base">Host</Typography>
                    <Typography className="text-white text-sm sm:text-base">{meeting?.hostDetails?.userName || 'N/A'}</Typography>
                  </div>
                </div>
                
                <div>
                  <Typography className="mb-2 font-bold text-blue-300 text-sm sm:text-base">Participants</Typography>
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <AvatarCard avatar={participants} />
                  </div>
                </div>
              </div>
            </Box>
            
            {/* Summary Section */}
            <Box 
              sx={{ 
                bgcolor: "#1f2937", 
                borderRadius: "0.75rem", 
                padding: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, 
                mb: { xs: 2, sm: 3, md: 4 },
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <Typography variant="h5" className="mb-3 md:mb-4 font-bold text-white text-lg sm:text-xl md:text-2xl">
                Meeting Summary
              </Typography>
              
              {meeting.enableSummary && meeting.fileUrl && meeting.fileName ? (
                <div className="space-y-4">
                  <Button 
                    startIcon={<Download />}
                    fullWidth
                    sx={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      padding: { xs: "0.5rem", sm: "0.5rem 1rem" },
                      borderRadius: "0.5rem",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      fontSize: { xs: "0.875rem", sm: "1rem" }
                    }}
                    onClick={() => window.open(meeting.fileUrl, '_blank')}
                  >
                    Download Summary
                  </Button>
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <DocumentPreview fileUrl={meeting.fileUrl} fileName={meeting.fileName} />
                  </div>
                </div>
              ) : meeting.enableSummary ? (
                <Button 
                  startIcon={<File />}
                  fullWidth
                  onClick={handleGenerateSummary}
                  disabled={generateLoading}
                  sx={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: { xs: "0.5rem", sm: "0.75rem 1.5rem" },
                    borderRadius: "0.5rem",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#059669" },
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  {generateLoading ? <LoaderCircle className="animate-spin" size={24} /> : "Generate PDF Summary"}
                </Button>
              ) : (
                <div className="flex items-center bg-yellow-900/30 p-3 border border-yellow-700/50 rounded-lg">
                  <div className="mr-3 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <Typography className="text-yellow-500 text-sm sm:text-base">
                    Summary generation is not enabled for this meeting
                  </Typography>
                </div>
              )}
            </Box>
            
            <div className="mt-4 sm:mt-6">
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 px-4 sm:px-6 py-2 sm:py-3 rounded-md w-full md:w-auto font-medium text-white text-sm sm:text-base transition-colors"
                onClick={() => router.replace('/user/dashboard')}
              >
                Schedule Next Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button - Only show if enableSummary is true */}
      {meeting?.enableSummary && (
        <div className="right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 fixed">
          <button
            onClick={toggleChatbot}
            className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 shadow-lg p-2 sm:p-3 rounded-full text-white transition-all"
            aria-label="Open meeting assistant"
          >
            {showChatbot ? (
              <X size={20} className="sm:w-6 sm:h-6" />
            ) : (
              <MessageSquare size={20} className="sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      )}

      {/* Chatbot Popup - Responsive sizes */}
      {showChatbot && meeting?.enableSummary && (
        <div 
          className="right-4 sm:right-6 bottom-4 sm:bottom-20 z-40 fixed flex flex-col bg-gray-800 shadow-xl rounded-lg w-[calc(100%-2rem)] max-w-[20rem] sm:max-w-[24rem] h-[60vh] max-h-[28rem] sm:max-h-[32rem] overflow-hidden"
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center bg-gray-900 p-2 sm:p-3 border-gray-700 border-b">
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-2 text-blue-400" />
              <Typography className="font-bold text-white text-sm sm:text-base">Meeting Assistant</Typography>
            </div>
            <IconButton 
              onClick={toggleChatbot} 
              sx={{ color: "#9ca3af", padding: "4px" }} 
              aria-label="Close chat"
            >
              <X size={16} />
            </IconButton>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 bg-gray-900 p-2 sm:p-3 overflow-y-auto">
            <div className="space-y-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Typography className="text-gray-300 text-xs sm:text-sm text-center">
                    Ask questions about your meeting to get insights!
                  </Typography>
                </div>
              )}
              
              {/* Messages */}
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 p-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    <Typography className="text-xs sm:text-sm whitespace-pre-line">{message.text}</Typography>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 p-2 rounded-lg rounded-bl-none">
                    <LoaderCircle className="animate-spin" size={16} />
                  </div>
                </div>
              )}
              
              {/* Empty div for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message Input */}
          <div className="bg-gray-800 p-2 border-gray-700 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your meeting..."
                className="flex-1 bg-gray-700 px-2 sm:px-3 py-1 sm:py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs sm:text-sm"
                disabled={loading}
              />
              <Button 
                type="submit"
                disabled={loading || !input.trim()}
                sx={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: { xs: "0.3rem", sm: "0.4rem" },
                  minWidth: { xs: "2rem", sm: "2.5rem" },
                  borderRadius: "0.5rem",
                  "&:hover": { backgroundColor: "#2563eb" },
                  "&:disabled": { backgroundColor: "#6b7280" }
                }}
                aria-label="Send message"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingSummary;