import React from "react";

const fileIcons = {
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
    if (!name) return "";
    return name.split(".").pop()?.toLowerCase() || "";
  };

  const fileExtension = getFileExtension(fileName);
  const fileIcon = fileIcons[fileExtension as keyof typeof fileIcons] || "📁";

  const handleDownload = () => {
    if (!fileUrl) {
      console.error("File URL is missing");
      return;
    }
    
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName || "download");
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (!fileUrl) {
      console.error("File URL is missing");
      return;
    }
    
    navigator.clipboard.writeText(fileUrl).then(() => {
      alert("File link copied to clipboard!");
    });
  };

  return (
    <div className="flex items-center bg-gray-800 shadow-lg mt-6 p-6 rounded-lg">
      <div className="mr-4 text-3xl">{fileIcon}</div>
      <div className="flex-grow">
        <div className="font-semibold text-white text-xl">{fileName || "Unnamed file"}</div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white transition-colors"
        >
          Download
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default FilePreview;