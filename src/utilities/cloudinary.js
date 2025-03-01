import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const __direname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__direname, "../config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary
