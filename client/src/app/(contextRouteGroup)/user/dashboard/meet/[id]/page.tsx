import MeetingSummary from "@/components/Solution/MeetSummary";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export function generateMetadata({ params: { id } }: PageProps): Metadata {
  return {
    title: `Meeting ${id}`,
    description: `details of meeting ${id}`,
  };
}

export default function page({ params: { id } }: PageProps) {
  const metadata = generateMetadata({ params: { id } });
  return (
    <>
      <div className="flex flex-col items-center sm:pt-11 pl-5 sm:pl-28 xs:pl-30 md:pl-32 lg:pl-56 min-h-screen px-4 w-full">
        <MeetingSummary id={id} />
      </div>
    </>
  );
}
