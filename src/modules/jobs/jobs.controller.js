import { Router } from "express";
import {
  authentication,
  authorization,
  checkCompany,
  companyAuthorization,
  multerCloud,
  validation,
} from "../../middleware/index.js";
import * as jobSchema from "./jobs.validation.js";
import * as jobService from "./jobs.service.js";
import { mimeExtensionTypes, roleTypes } from "../../utilities/constants.js";

export const companyJobsRouter = Router({ mergeParams: true });
export const jobsRouter = Router();

// 1. Add Job
companyJobsRouter.post(
  "/addJob",
  validation(jobSchema.addJobSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  jobService.addJob
);

// 2. Update Job
companyJobsRouter.patch(
  "/updateJob/:jobId",
  validation(jobSchema.updateJobSchema),
  authentication(),
  checkCompany,
  jobService.updateJob
);

// 3. Delete Job
companyJobsRouter.delete(
  "/deleteJob/:jobId",
  validation(jobSchema.jobIdSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ hr: true }),
  jobService.deleteJob
);

// 4. Get all Jobs or a specific one for a specific company
companyJobsRouter.get(
  "/getJobs/:jobId?",
  validation(jobSchema.getJobsSchema),
  checkCompany,
  jobService.getJobs
);

// 5. Get all Jobs that match the following filters and
// if no filters apply then get all jobs
jobsRouter.get(
  "/getFilteredJobs",
  validation(jobSchema.getFilteredJobsSchema),
  jobService.getFilteredJobs
);

// 6. Get all applications for specific Job
companyJobsRouter.get(
  "/getApplications/:jobId",
  validation(jobSchema.jobIdSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  jobService.getApplications
);

// 7. Apply to Job (Job application)
jobsRouter.post(
  "/applyToJob/:jobId",
  multerCloud(mimeExtensionTypes.file).single("userCV"),
  validation(jobSchema.applyToJobSchema),
  authentication(),
  authorization([roleTypes.user]),
  jobService.applyToJob
);

// 8. Accept or Reject an Applicant
companyJobsRouter.patch(
  "/applications/status/:applicationId",
  validation(jobSchema.appStatusSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ hr: true }),
  jobService.appStatus
);
