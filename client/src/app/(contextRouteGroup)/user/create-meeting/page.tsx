"use client";

import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axios";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FiEdit } from "react-icons/fi";

export default function CreateMeetingPage() {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [activeTime, setActiveTime] = useState(false);
  const [activeType, setActiveType] = useState(false);
  const [participantsInput, setParticipantsInput] = useState("");
  const [call, setCall] = useState<Call>();
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [enableSummary, setEnableSummary] = useState(false);
  const [join, setJoin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState("");

  const client = useStreamVideoClient();
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      // const users = [
      //   { email: "john.doe@example.com", userName: "John Doe" },
      //   { email: "jane.smith@example.com", userName: "Jane Smith" },
      //   { email: "alice.wonderland@example.com", userName: "Alice Wonderland" },
      // ];

      const res = await axiosInstance.get("/user/get-all-users");
      setAllUsers(res.data.data);
    };
    fetchUsers();
  }, []);

  async function createMeeting() {
    if (!client || !user) {
      return;
    }
    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      const response = await call.getOrCreate({
        data: {
          custom: { description: descriptionInput ? descriptionInput : "" },
        },
      });
      setCall(call);
      if (call) {
        console.log(startTimeInput);

        const res: any = await axiosInstance.post("/meeting/create-meeting", {
          title: titleInput,
          description: descriptionInput,
          participants: selectedParticipants,
          scheduledTime: startTimeInput,
          status: activeTime ? "scheduled" : "not scheduled",
          roomId: call?.cid,
          type: activeType ? "private" : "public",
          enableSummary: enableSummary,
        });
        console.log(res);
        
        if (res?.data.statusCode === 201) {
          setError("")
          router.replace(`/user/meeting/${call?.id}`);
        } 
      }
    } catch (error: any) {
      const regex = /Error: (.*?)(<|\\n|$)/;
      const match = error?.response?.data?.toString()?.match(regex);

      if (match) {
        const message = match[1].trim();
        console.log(message);
        setError(message);
        console.log(error);
      }
      console.error("Error creating meeting:", error);
    }
  }

  const joinMeeting = async () => {
    if (roomId.trim().length === 44) {
      router.push(`meeting/${roomId.trim()}`);
    } else {
      alert("Please enter a valid meeting ID.");
    }
  };

  const scheduleMeeting = async () => {
    /* Api request for the schedule meeting */

    console.log("Button clicked and function is executing!");

    if (!client || !user) {
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      const date = new Date(startTimeInput);
      date.setHours(date.getHours() + 5, date.getMinutes() + 30);

      // Format as RFC3339 (YYYY-MM-DDTHH:mm:ss+05:30)
      const startTimeIST = date.toISOString().replace("Z", "+05:30"); // Ensure it has seconds and timezone
      // console.log("Call id: ", call?.cid.length);
      if (activeType) {
        const response = await call.getOrCreate({
          data: {
            custom: { description: descriptionInput && descriptionInput },
            starts_at: startTimeIST,
          },
        });
      } else {
        const response = await call.getOrCreate({
          data: {
            custom: { description: descriptionInput && descriptionInput },
            starts_at: startTimeIST,
          },
        });
      }
      setCall(call);
      if (call) {
        console.log(startTimeInput);
        const res: any = await axiosInstance.post("/meeting/create-meeting", {
          title: titleInput,
          description: descriptionInput,
          participants: selectedParticipants,
          scheduledTime: startTimeIST,
          status: activeTime ? "scheduled" : "not scheduled",
          roomId: call?.cid,
          type: activeType ? "private" : "public",
          enableSummary: enableSummary,
        });
        console.log(res.data.data);
        if (res?.data.statusCode === 201) {
          setError("")
          const sendNotificationOFScheduledMeeting = await axiosInstance.get(
            `/meeting/send-meeting-notification/${call?.cid}`
          );
          router.push("/user/dashboard");
        } else {
          const regex = /Error: (.*?)(<|\\n|$)/;
          const match = res?.response?.data?.toString()?.match(regex);

          if (match) {
            const message = match[1].trim();
            console.log(message);
            setError(message);
            console.log(error);
          }
          setTimeout(() => {
            setError("");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const filteredUsers = allUsers.filter(
    (user: any) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!client || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="animate-spin text-indigo-500" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueAccent-1001 flex flex-col items-center py-10 px-4">
      <h1 className="text-center text-3xl font-extrabold text-white mb-8">
        Welcome, {user.userName}!
      </h1>
      {error && <p className="text-red-600 w-full text-center">{error}</p>}
      <div className="w-full max-w-md bg-blueAccent-1002 rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white">Create a New Meeting</h2>
        <TitleInput value={titleInput} onChange={setTitleInput} />
        <DescriptionInput
          value={descriptionInput}
          onChange={setDescriptionInput}
        />
        <StartTimeInput
          value={startTimeInput}
          onChange={setStartTimeInput}
          activeTime={activeTime}
          setActiveTime={setActiveTime}
        />
        <ParticipantsInput
          users={allUsers}
          selectedParticipants={selectedParticipants}
          setSelectedParticipants={setSelectedParticipants}
          activeType={activeType}
          setActiveType={setActiveType}
          setShowModal={setShowModal}
        />
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableSummary"
            checked={enableSummary}
            onChange={(e) => setEnableSummary(e.target.checked)}
            className="w-4 h-4 text-purpleAccent-200 focus:ring-purpleAccent-100 border-gray-300 rounded"
          />
          <label htmlFor="enableSummary" className="text-white font-semibold">
            Enable Meeting Summary
          </label>
        </div>

        {activeTime ? (
          <button
            onClick={scheduleMeeting}
            className="w-full bg-purpleAccent-200 hover:bg-purpleAccent-100 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition transform hover:scale-105 duration-300"
            style={{ padding: "12px 24px", borderRadius: "8px" }} // Adjust padding and border-radius
          >
            Schedule Meeting
          </button>
        ) : (
          <div className="flex gap-5 flex-col">
            <button
              onClick={createMeeting}
              className="w-full bg-purpleAccent-200 hover:bg-purpleAccent-100 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition transform hover:scale-105 duration-300"
              style={{ padding: "12px 24px", borderRadius: "8px" }} // Adjust padding and border-radius
            >
              Create Meeting
            </button>

            <button
              className="w-full bg-blue-900 hover:bg-blue-2 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition transform hover:scale-105 duration-300"
              onClick={() => setJoin(true)}
              style={{ padding: "12px 24px", borderRadius: "8px" }} // Adjust padding and border-radius
            >
              Join a Meeting
            </button>
          </div>
        )}

        {join && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter Meeting ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={joinMeeting}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition transform hover:scale-105 duration-300"
            >
              Join
            </button>
          </div>
        )}
      </div>
      {call && !error && <MeetingLink call={call} />}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#313131] p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Invite Participants</h2>
            <input
              type="text"
              placeholder="Search by email or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              {filteredUsers.map((user: any) => (
                <label
                  key={user.email}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(user.email)}
                    onChange={() => {
                      const newSelected = selectedParticipants.includes(
                        user.email
                      )
                        ? selectedParticipants.filter(
                            (email) => email !== user.email
                          )
                        : [...selectedParticipants, user.email];
                      setSelectedParticipants(newSelected);
                    }}
                  />
                  {user.userName} ({user.email})
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 text-red-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <label className="block">
      <span className="text-white font-medium">Title</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter meeting title"
      />
    </label>
  );
}

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="block">
      <div className="text-white font-medium mb-2">Meeting Info:</div>
      <label className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            if (!e.target.checked) {
              onChange("");
            }
          }}
          className="form-checkbox h-5 w-5 text-indigo-600"
        />
        <span className="text-gray-300">Add Description</span>
      </label>
      {active && (
        <label className="block">
          <span className="text-white font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            rows={4}
            className="mt-1 block w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meeting description (optional)"
          />
          <div className="text-gray-400 text-sm text-right">
            {value.length}/500
          </div>
        </label>
      )}
    </div>
  );
}

interface StartTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  activeTime: boolean;
  setActiveTime: (value: boolean) => void;
}

function StartTimeInput({
  value,
  onChange,
  activeTime,
  setActiveTime,
}: StartTimeInputProps) {
  console.log(value);

  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="block">
      <div className="text-white font-medium mb-2">Meeting Start:</div>
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!activeTime}
            onChange={() => {
              setActiveTime(false);
              onChange("");
            }}
            className="form-radio h-5 w-5 text-indigo-600"
          />
          <span className="text-gray-300">Start immediately</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={activeTime}
            onChange={() => {
              setActiveTime(true);
              onChange(dateTimeLocalNow);
            }}
            className="form-radio h-5 w-5 text-indigo-600"
          />
          <span className="text-gray-300">Schedule for later</span>
        </label>
      </div>
      {activeTime && (
        <label className="block">
          <span className="text-white font-medium">Start Time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeLocalNow}
            className="mt-1 block w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      )}
    </div>
  );
}

interface ParticipantsInputProps {
  users: { email: string; userName: string; avatar?: string }[];
  selectedParticipants: string[];
  setSelectedParticipants: (participants: []) => void;
  activeType: boolean;
  setActiveType: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
}

function ParticipantsInput({
  users,
  selectedParticipants,
  setSelectedParticipants,
  activeType,
  setActiveType,
  setShowModal,
}: ParticipantsInputProps) {
  const [showModal, setLocalShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter users based on the search term
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="block">
      <div className="text-gray-100 font-medium mb-3">Participants:</div>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!activeType}
            onChange={() => {
              setActiveType(false);
              setSelectedParticipants([]);
            }}
            className="form-radio h-5 w-5 text-green-500 focus:ring-green-400 focus:outline-none transition-transform duration-150 transform hover:scale-105"
          />
          <span className="text-gray-300">Anyone with the link</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={activeType}
            onChange={(e) => {
              setActiveType(e.target.checked);
              if (e.target.checked) setShowModal(true);
            }}
            className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-400 focus:outline-none transition-transform duration-150 transform hover:scale-105"
          />
          <span className="text-gray-300">Private Meeting</span>
        </label>
      </div>

      {activeType && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="text-gray-100">
              Selected Participants: {selectedParticipants.length}
            </div>
            <FiEdit
              onClick={() => setShowModal(true)}
              className="text-gray-100 cursor-pointer hover:text-blue-400 transition duration-150 transform hover:scale-105"
              aria-label="Edit participants"
            />
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-h-[80vh] w-full max-w-lg overflow-y-auto transform transition-all duration-200 scale-100 hover:scale-105 shadow-lg">
            <h2 className="text-xl font-bold text-gray-200 mb-5">
              Invite Participants
            </h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by email or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              aria-label="Search participants"
            />

            {/* Participants List */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <label
                    key={user.email}
                    className={`flex items-center gap-2 p-3 rounded-md transition-all duration-150 cursor-pointer ${
                      selectedParticipants.includes(user.email)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(user.email)}
                      onChange={() => {
                        const newSelected: any = selectedParticipants.includes(
                          user.email
                        )
                          ? selectedParticipants.filter(
                              (email) => email !== user.email
                            )
                          : [...selectedParticipants, user.email];
                        setSelectedParticipants(newSelected);
                      }}
                      className="form-checkbox h-5 w-5 text-teal-400 rounded-md focus:ring-teal-500"
                      aria-label={`Select ${user.userName}`}
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-semibold">{user.userName}</span>
                        <span className="text-sm text-gray-400 block">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center">
                  No participants found.
                </p>
              )}
            </div>

            {/* Selected Count and Controls */}
            <div className="mt-5 flex justify-between items-center">
              <span className="text-gray-100 font-semibold">
                Selected Participants: {selectedParticipants.length}
              </span>
              <button
                onClick={() => setSelectedParticipants([])}
                className="text-red-400 text-sm hover:underline focus:outline-none"
                aria-label="Deselect all participants"
              >
                Deselect All
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-red-400 hover:text-red-300 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Cancel selection"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Confirm selection"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MeetingLinkProps {
  call: Call;
}

function MeetingLink({ call }: MeetingLinkProps) {
  const meetingLink = `http://localhost:3000/user/meeting/${call.id}`;

  return (
    <div className="mt-6 bg-gray-800 rounded-md p-4 w-full max-w-md">
      <h3 className="text-white font-semibold mb-2">
        Meeting Created Successfully!
      </h3>
      <p className="text-gray-300 break-all">
        Share this link with your participants:
      </p>
      <a
        href={meetingLink}
        className="text-indigo-400 underline mt-1 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {meetingLink}
      </a>
    </div>
  );
}
