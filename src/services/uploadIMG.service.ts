import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export async function uploadIMG(filePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "uploaded_images_blog",
      resource_type: "image",
    });

    return uploadResult.secure_url; // Trả về URL của ảnh đã upload
  } catch (error) {
    console.error("Lỗi upload bg:", error);
    return null;
  }
}
