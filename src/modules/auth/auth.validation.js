import Joi from "joi";
import {
  genderTypes,
  generalRules,
  isValidDOB,
} from "../../utilities/index.js";

export const signupSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    gender: Joi.string().valid(genderTypes.female, genderTypes.male),
    dob: Joi.date()
      .custom((value, helper) => {
        const { isValid, message } = isValidDOB(value);
        return isValid ? value : helper.message(message);
      })
      .required(),
    mobileNumber: generalRules.mobileNumber.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const confirmOTPSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: generalRules.code.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const signinSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const signupWithGoogleSchema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    code: generalRules.code.required(),
  }).messages({ "any.required": "{#key} is required." }),
};
