import React from "react";

const fileIcons: { [key: string]: string } = {
  pdf: "📄",
  jpg: "🖼️",
  jpeg: "🖼️",
  png: "🖼️",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  txt: "📄",
  csv: "📊",
};

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl, fileName }) => {
  const getFileExtension = (name: string) => {
    return fileUrl?.split(".")?.pop()?.toLowerCase();
  };

  const fileExtension = getFileExtension(fileName);
  const fileIcon = fileIcons[fileExtension as keyof typeof fileIcons] || "📁";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(fileUrl).then(() => {
      alert("File link copied to clipboard!");
    });
  };

  return (
    <div className="flex items-center bg-gray-800 shadow-lg mt-6 p-6 rounded-lg">
      <div className="mr-4 text-3xl">{fileIcon}</div>
      <div className="flex-grow">
        <div className="font-semibold text-white text-xl">{fileName}</div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleDownload}
          className="bg-blue-500 px-4 py-2 rounded-md text-white"
        >
          Download
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 px-4 py-2 rounded-md text-white"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
