import Joi from "joi";
import {
  genderTypes,
  generalRules,
  isValidDOB,
} from "../../utilities/index.js";

export const updateUserAccountSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    dob: Joi.date().custom((value, helper) => {
      const { isValid, message } = isValidDOB(value);
      return isValid ? value : helper.message(message);
    }),
    mobileNumber: generalRules.mobileNumber,
    gender: Joi.string().valid(genderTypes.female, genderTypes.male),
  }),
};

export const getProfileSchema = {
  params: Joi.object({
    userId: generalRules.id.required(),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
    cPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const uploadPicSchema = {
  file: generalRules.file
    .required()
    .messages({ "any.required": "{#key} is required." }),
};
