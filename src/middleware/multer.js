import multer from "multer";
import { AppError } from "../utilities/errorHandler.js";

export const multerCloud = (customValidation = []) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    customValidation.includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError("Invalid file type", 400));
  };

  const upload = multer({ storage, fileFilter });

  return upload;
};
