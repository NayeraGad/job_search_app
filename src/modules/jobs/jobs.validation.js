import Joi from "joi";
import { generalRules, statusTypes } from "../../utilities/index.js";

export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: generalRules.jobLocation.required(),
    workingTime: generalRules.workingTime.required(),
    seniorityLevel: generalRules.seniorityLevel.required(),
    jobDescription: Joi.string().required(),
    technicalSkills: generalRules.technicalSkills.required(),
    softSkills: Joi.array().items(Joi.string()).required(),
  }).messages({ "any.required": "{#key} is required." }),
  params: Joi.object({
    companyId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const updateJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: generalRules.jobLocation,
    workingTime: generalRules.workingTime,
    seniorityLevel: generalRules.seniorityLevel,
    jobDescription: Joi.string(),
    technicalSkills: generalRules.technicalSkills,
    softSkills: Joi.array().items(Joi.string()),
  }),
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const jobIdSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const getJobsSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id,
  }).messages({ "any.required": "{#key} is required." }),
  query: Joi.object({
    companyName: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
  }),
};

export const getFilteredJobsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    jobTitle: Joi.string(),
    jobLocation: generalRules.jobLocation,
    workingTime: generalRules.workingTime,
    seniorityLevel: generalRules.seniorityLevel,
    technicalSkills: generalRules.technicalSkills,
  }),
};

export const applyToJobSchema = {
  file: generalRules.file.required(),
  params: Joi.object({
    jobId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};

export const appStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid(statusTypes.accepted, statusTypes.rejected)
      .required(),
  }),
  params: Joi.object({
    applicationId: generalRules.id.required(),
    companyId: generalRules.id.required(),
  }).messages({ "any.required": "{#key} is required." }),
};
