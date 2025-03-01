import Joi from "joi";
import { Types } from "mongoose";
import {
  jobLocationTypes,
  seniorityLevelTypes,
  workingTimeTypes,
} from "./constants.js";

export const customId = (value, helper) => {
  const data = Types.ObjectId.isValid(value);

  return data ? value : helper.message("Id is not valid");
};

export const isValidDOB = (value) => {
  const dob = new Date(value);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();
  let monthDiff = currentDate.getMonth() - dob.getMonth();

  if (monthDiff < 0) age--;

  return age > 18
    ? { isValid: true }
    : { isValid: false, message: "age must be greater than 18 years" };
};

export const generalRules = {
  id: Joi.string().custom(customId),
  email: Joi.string().email(),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
  mobileNumber: Joi.string().regex(/^01[01259][0-9]{8}$/),
  code: Joi.string().length(5),
  jobLocation: Joi.string().valid(...Object.values(jobLocationTypes)),
  workingTime: Joi.string().valid(...Object.values(workingTimeTypes)),
  seniorityLevel: Joi.string().valid(...Object.values(seniorityLevelTypes)),
  technicalSkills: Joi.array().items(Joi.string()),
  file: Joi.object({
    size: Joi.number().positive(),
    path: Joi.string(),
    filename: Joi.string(),
    destination: Joi.string(),
    mimetype: Joi.string(),
    encoding: Joi.string(),
    originalname: Joi.string(),
    fieldname: Joi.string(),
  }),
};
