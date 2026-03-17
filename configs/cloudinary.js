import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    clound_name: process.env.CLOUDINARY_CLOUD_NAME,
    clound_name: process.env.CLOUDINARY_API_KEY,
    clound_name: process.env.CLOUDINARY_API_SECRET,
  });
};

export default connectCloudinary;
