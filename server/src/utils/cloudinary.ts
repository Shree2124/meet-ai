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
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File does not exist:", localFilePath);
      return null;
    }

    const fileExtension = path.extname(localFilePath).toLowerCase();
    let resourceType: "raw" | "image" | "video" | "auto" = "auto";

    if (
      [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(fileExtension)
    ) {
      resourceType = "image";
    } else if (
      [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm"].includes(fileExtension)
    ) {
      resourceType = "video";
    }

    const publicId = path.basename(localFilePath, fileExtension);

    const uploadOptions: UploadApiOptions = {
      public_id: publicId,
      resource_type: resourceType, // <- Use correct resourceType
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);
    console.log("Cloudinary upload successful:", response.secure_url);

    fs.unlinkSync(localFilePath); // delete only after successful upload
    return response;
  } catch (error: any) {
    console.error("Cloudinary Error:", error);

    // Optional: only delete if file exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;
