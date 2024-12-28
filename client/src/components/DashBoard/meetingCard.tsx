"use client";

import Image from "next/image";
import { useState } from "react";
import icon from "@/assets/icons/upcoming.svg";
import { IconSettingsFilled } from "@tabler/icons-react";
import { CopyPlus } from "lucide-react";

interface Participant {
  userId: string;
  userName: string;
  avatar: string | null;
  role: string;
}

interface MeetingCardProps {
  title: string;
  description?: string;
  scheduledTime?: string;
  icon: string;
  participants?: Participant[];
  status: string;
  roomId: string;
  host: string;
  type: string;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
}

const MeetingCard = ({
  roomId,
  // icon,
  handleClick,
  title,
  description,
  type,
  scheduledTime,
  participants=[],
  // buttonIcon1,
  // handleClick,
  buttonText = "Join meet",
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/meeting/${roomId.split(":")[1]}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {});
    alert("Link copied successfully!")
  };

  // Format the date
  const formattedDate = new Date(scheduledTime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPastMeeting = new Date(scheduledTime) < new Date();

  return (
    <section
      className={`relative flex flex-col items-center justify-center rounded-xl p-6 md:p-8 xl:p-6 transition-all duration-300 overflow-hidden`}
      style={{
        width: "100%",
        maxWidth: "568px",
        height: "100%",
        minHeight: "100%",
        margin: "0 auto",
      }}
    >
      {/* Icon */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Image src={icon} alt="Meeting icon" width={28} height={28} />
      </div>

      {/* Title and Date */}
      <article className="flex flex-col items-center text-center mt-8 md:mt-10">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        <p className="text-base font-normal mt-1 md:mt-2">{description}</p>
        <p className="text-base font-normal mt-1 md:mt-2">{formattedDate}</p>
      </article>

      {/* Avatar List */}
      <div className="flex items-center justify-center mt-4 md:mt-6">
        <div className="flex -space-x-3">
          {participants?.slice(0, 4)?.map((participant:any, index:number) => (
            <Image
              key={participant.userId}
              src={
                participant.avatar ||
                "https://www.w3schools.com/howto/img_avatar.png"
              } // Use a default avatar if none is provided
              alt={participant.userName}
              width={40}
              height={40}
              className="rounded-full border-2 border-white md:w-12 md:h-12"
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      {isPastMeeting ? (
        <p className="mt-6 md:mt-8 text-lg font-semibold text-gray-500">
          Meeting ended
        </p>
      ) : (
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-6 md:mt-8 rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300 bg-blue-500 text-white hover:bg-white hover:text-blue-500 shadow-md"
        >
          {isHovered ? "Start meet" : buttonText}
        </button>
      )}
      <div className="absolute right-0 bottom-1 flex gap-3">
        <IconSettingsFilled />
        <CopyPlus onClick={handleCopy} className="cursor-pointer"/>
      </div>
    </section>
  );
};

export default MeetingCard;
