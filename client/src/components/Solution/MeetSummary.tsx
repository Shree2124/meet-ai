// "use client";

// import { Box, Button, IconButton, Typography } from "@mui/material";
// import AvatarCard from "../User/Avatar/AvatarCard";
// import DocumentPreview from "./FilePreview";
// import axiosInstance from "@/utils/axios";
// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { CircleArrowLeftIcon, LoaderCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// const MeetingSummary = ({ id }: any) => {
//   const [meeting, setMeeting] = useState<any>(null);
//   const [participants, setParticipants] = useState<any>([]);
//   const [showModal, setShowModal] = useState<Boolean>(false);
//   const [loading, setLoading] = useState<Boolean>(false);
//   const router = useRouter();

//   const fileIcons: { [key: string]: string } = {
//     pdf: "📄",
//     docx: "📝",
//     txt: "📄",
//   };

//   const [selectedFileType, setSelectedFileType] = React.useState("");
//   const [error, setError] = useState("");

//   const handleGenerateSummary = async () => {
//     try {
//       setLoading(true);
//       const res: any = await axiosInstance.patch(
//         `/summary/summary-file/${meeting?.roomId}`,
//         {
//           type: selectedFileType,
//         }
//       );
//       console.log(res.data.data);
//       setMeeting(res.data.data);
//       setLoading(false);
//       setShowModal(false);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//     setSelectedFileType(event.target.value);
//     setError("");
//   };

//   const handleGenerate = () => {
//     if (!selectedFileType) {
//       setError("Please select a file type before generating.");
//     } else {
//       handleGenerateSummary();
//     }
//   };

//   const fetchDetails = async () => {
//     try {
//       const response = await axiosInstance.get(`/meeting/get-meeting/${id}`);
//       console.log(response);
      
//       const meetingData = response.data.data;
//       console.log(meetingData);
//       setMeeting(meetingData);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleBack = () => {
//     router.push("/user/dashboard/history");
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [id]);

//   useEffect(() => {
//     if (meeting) {
//       const participantAvatars = meeting.participants
//         ?.filter((participant: any) => participant.role === "participant")
//         .map((participant: any) => ({
//           name: participant.userName,
//           avatar:
//             participant.avatar ||
//             "https://www.w3schools.com/howto/img_avatar.png",
//         }));
//       setParticipants(participantAvatars);
//     }
//   }, [meeting]);

//   return (
//     <div className="bg-gray-900 text-gray-300 w-full min-h-screen">
//       <div>
//         <IconButton onClick={handleBack} sx={{ color: "white", cursor: "pointer", zIndex: 30 }}>
//           <CircleArrowLeftIcon height={"3rem"} width={"3rem"} />
//         </IconButton>
//       </div>
//       <div className="container mx-auto p-6">
//         {/* Hero Section */}
//         <header className=" mb-8">
//           <h1 className="text-center text-4xl font-bold text-white shadow-md">
//             Meeting Summary
//           </h1>
//         </header>
//         <Box
//           sx={{
//             marginTop: "1.5rem",
//             bgcolor: "#1f2937",
//             borderRadius: "1rem",
//             padding: "1.5rem",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <h2 className="text-xl font-semibold">Meeting Details</h2>
//           <div>
//             <p className="text-lg">
//               <strong>Title:</strong> {meeting?.title}
//             </p>
//             <p className="text-lg">
//               <strong>Description: </strong>
//               {meeting?.description}
//             </p>
//             <p className="text-lg">
//               <strong>Date: </strong>
//               {moment(meeting?.scheduledAt).format("MMMM Do YYYY")} | Duration:
//               1 hour
//             </p>
//           </div>
//         </Box>

//         {/* Meeting Overview Card */}
//         <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
//           <h2 className="text-xl font-semibold">Meeting Overview</h2>
//           <p>
//             <strong>Host:</strong> {meeting?.hostDetails?.userName}
//           </p>
//           <p>
//             <strong>Participants:</strong>
//           </p>

//           <AvatarCard avatar={participants} />
//         </div>

//         {meeting?.enableSummary && meeting?.fileUrl && meeting.fileName ? (
//           <DocumentPreview
//             fileUrl={meeting?.fileUrl}
//             fileName={meeting?.fileName}
//           />
//         ) : meeting?.enableSummary ? (
//           <Button onClick={() => setShowModal(true)}>Generate Summary</Button>
//         ) : (
//           <Typography variant="subtitle2" color="warning">
//             Summarize not enable
//           </Typography>
//         )}

//         {/* Call to Action */}
//         <div className="text-center mt-8">
//           <button className="px-6 py-3 bg-green-500 rounded-md hover:bg-green-600">
//             Schedule Next Meeting
//           </button>
//         </div>

//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative">
//               {/* Close Button */}
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-3 text-gray-300 hover:text-white"
//               >
//                 ✖
//               </button>

//               <h2 className="text-xl font-bold text-white mb-4">
//                 Select File Type
//               </h2>
//               <div className="relative mb-4">
//                 <select
//                   value={selectedFileType}
//                   onChange={handleChange}
//                   className="bg-gray-700 text-white p-3 pr-7 w-full rounded-lg appearance-none cursor-pointer focus:outline-none border border-gray-700 hover:border-gray-500 focus:border-white"
//                 >
//                   <option
//                     className="w-full pr-4 bg-gray-700 text-white"
//                     value=""
//                     disabled
//                   >
//                     Select a file type...
//                   </option>
//                   {Object.keys(fileIcons).map((type) => (
//                     <option
//                       key={type}
//                       value={type}
//                       className="bg-gray-700 text-white"
//                     >
//                       {fileIcons[type]} {type.toUpperCase()}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-white">
//                   ▼
//                 </div>
//               </div>

//               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//               <button
//                 onClick={handleGenerate}
//                 className={`w-full p-3 rounded-lg font-semibold ${
//                   selectedFileType
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-600 text-gray-300 cursor-not-allowed"
//                 }`}
//                 disabled={!selectedFileType}
//               >
//                 {loading ? (
//                   <div className="flex justify-center items-center">
//                     <LoaderCircle className="animate-spin text-white" size={24} />
//                   </div>
//                 ) : (
//                   "Generate"
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MeetingSummary;

"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import AvatarCard from "../User/Avatar/AvatarCard";
import DocumentPreview from "./FilePreview";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CircleArrowLeftIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const MeetingSummary = ({ id }: any) => {
  const [meeting, setMeeting] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const router = useRouter();

  const fileIcons: { [key: string]: string } = {
    pdf: "📄",
    docx: "📝",
    txt: "📄",
  };

  const [selectedFileType, setSelectedFileType] = React.useState("");
  const [error, setError] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.patch(
        `/summary/summary-file/${meeting?.roomId}`,
        {
          type: selectedFileType,
        }
      );
      setMeeting(res.data.data);
      setLoading(false); 
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedFileType(event.target.value);
    setError("");
  };

  const handleGenerate = () => {
    if (!selectedFileType) {
      setError("Please select a file type before generating.");
    } else {
      handleGenerateSummary();
    }
  };

  const fetchDetails = async () => {
    try {
      console.log("ID: ", id);
      
      const response = await axiosInstance.get(`/meeting/get-meeting/${id}`);
      const meetingData = response.data.data;
      console.log("MeetingData: ", meetingData);
      
      setMeeting(meetingData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    router.push("/user/dashboard/history");
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (meeting) {
      const participantAvatars = meeting.participants
        ?.filter((participant: any) => participant.role === "participant")
        .map((participant: any) => ({
          name: participant.userName,
          avatar:
            participant.avatar ||
            "https://www.w3schools.com/howto/img_avatar.png",
        }));
      setParticipants(participantAvatars);
    }
  }, [meeting]);

  return (
    <div className="bg-gray-900 text-gray-300  w-full flex items-center justify-center overflow-y-hidden ">
      <div className="w-full max-w-5xl p-6">
        <IconButton onClick={handleBack} sx={{ color: "white", cursor: "pointer" }}>
          <CircleArrowLeftIcon height={"3rem"} width={"3rem"} />
        </IconButton>
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Meeting Summary</h1>
        </header>
        <Box sx={{ bgcolor: "#1f2937", borderRadius: "1rem", padding: "1.5rem", mb: 3 }}>
          <Typography variant="h5" className="text-white">Meeting Details</Typography>
          <Typography className="text-lg"><strong>Title:</strong> {meeting?.title || 'N/A'}</Typography>
          <Typography className="text-lg"><strong>Description:</strong> {meeting?.description || 'N/A'}</Typography>
          <Typography className="text-lg"><strong>Date:</strong> {moment(meeting?.scheduledTime).format("MMMM Do YYYY") || 'N/A'}</Typography>
        </Box>
        <Box className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <Typography variant="h5" className="text-white">Meeting Overview</Typography>
          <Typography><strong>Host:</strong> {meeting?.hostDetails?.userName || 'N/A'}</Typography>
          <Typography><strong>Participants:</strong></Typography>
          <AvatarCard avatar={participants} />
        </Box>
        {meeting?.enableSummary && meeting?.fileUrl && meeting.fileName ? (
          <DocumentPreview fileUrl={meeting?.fileUrl} fileName={meeting?.fileName} />
        ) : meeting?.enableSummary ? (
          <Button onClick={() => setShowModal(true)}>Generate Summary</Button>
        ) : (
          <Typography variant="subtitle2" color="warning">Summary generation is not enabled for this meeting</Typography>
        )}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-green-500 rounded-md hover:bg-green-600" onClick={() => router.replace('/user/dashboard')}>Schedule Next Meeting</button>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-300 hover:text-white">✖</button>
              <Typography variant="h5" className="text-white mb-4">Select File Type</Typography>
              <select value={selectedFileType} onChange={handleChange} className="bg-gray-700 text-white p-3 w-full rounded-lg border border-gray-700">
                <option value="" disabled>Select a file type...</option>
                {Object.keys(fileIcons).map((type) => (
                  <option key={type} value={type}>{fileIcons[type]} {type.toUpperCase()}</option>
                ))}
              </select>
              {error && <Typography color="error" className="text-sm mt-4">{error}</Typography>}
              <Button onClick={handleGenerate} className="w-full mt-4" disabled={!selectedFileType}>
                {loading ? <LoaderCircle className="animate-spin" size={24} /> : "Generate"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingSummary;
