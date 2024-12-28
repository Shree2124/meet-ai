import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;
    const fileExtension = path.extname(localFilePath).toLowerCase();
    let resourceType: "raw" | "image" | "video" | "auto" = "raw";
    if (
      [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(fileExtension)
    ) {
      resourceType = "image";
    } else if (
      [".mp4", ".avi", ".mov", ".wmv", ".flv"].includes(fileExtension)
    ) {
      resourceType = "video";
    }
    const uploadOptions: UploadApiOptions = {
      public_id: localFilePath.split("\\").pop()?.split(".")[0],
      resource_type: resourceType || "auto",
    };
    const response = await cloudinary.uploader.upload(
      localFilePath,
      uploadOptions
    );
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary Error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
