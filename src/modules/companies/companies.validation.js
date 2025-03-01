import Joi from "joi";
import { generalRules } from "../../utilities/index.js";

export const addCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    "numberOfEmployees.min": Joi.number().integer().required(),
    "numberOfEmployees.max": Joi.number()
      .integer()
      .custom((value, helper) => {
        if (value["numberOfEmployees.min"] >= value["numberOfEmployees.max"]) {
          return helper.message(
            "numberOfEmployees.max must be greater than numberOfEmployees.min"
          );
        }
      })
      .required(),
    companyEmail: generalRules.email.required(),
    HRs: Joi.array().items(generalRules.id),
  }).messages({ "any.required": "{#key} is required." }),
  file: generalRules.file.required(),
};

export const updateCompanySchema = {
  body: Joi.object({
    companyName: Joi.string(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.object({
      min: Joi.number().integer(),
      max: Joi.number().integer().greater(Joi.ref("min")),
    }),
    companyEmail: generalRules.email,
    HRs: Joi.array().items(generalRules.id),
  }),
  params: Joi.object({
    companyId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const companyIdSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const searchCompanySchema = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const uploadPicSchema = {
  file: generalRules.file.required(),
  params: Joi.object({
    companyId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};
