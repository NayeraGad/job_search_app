import { populate } from "dotenv";
import {
  applicationModel,
  companyModel,
  jobModel,
} from "../../DB/models/index.js";
import {
  AppError,
  asyncHandler,
  cloudinary,
  eventEmitter,
  pagination,
  statusTypes,
} from "../../utilities/index.js";

// ************************addJob**************************
export const addJob = asyncHandler(async (req, res, next) => {
  const job = await jobModel.create({
    ...req.body,
    addedBy: req.user._id,
    companyId: req.company._id,
  });

  return res.status(201).json({ message: "done", job });
});

// ************************updateJob**************************
export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  const job = await jobModel.findOneAndUpdate(
    { _id: jobId, addedBy: req.user._id },
    {
      ...req.body,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", job });
});

// ************************deleteJob**************************
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  await jobModel.updateOne({ _id: jobId }, { closed: true });

  return res.status(200).json({ message: "done" });
});

// ************************getJobs**************************
export const getJobs = asyncHandler(async (req, res, next) => {
  const { companyName, page, limit, sort } = req.query;
  let filter = { closed: false, companyId: req.company._id };

  if (companyName) {
    const company = await companyModel.findOne({
      companyName,
      bannedAt: { $exists: false },
      deletedAt: { $exists: false },
    });

    if (!company) {
      return next(new AppError("Company not found", 404));
    }

    filter.companyId = company._id;
  }

  if (req.params.jobId) {
    filter._id = req.params.jobId;
  }

  const {
    data: jobs,
    totalCount,
    page: pageNumber,
  } = await pagination({
    page,
    limit,
    sort,
    model: jobModel,
    filter,
  });

  return res
    .status(200)
    .json({ message: "done", totalCount, pageNumber, jobs });
});

// ************************getFilteredJobs**************************
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { page, limit, sort } = req.query;

  const filter = { closed: false };

  if (req.query.jobTitle) filter.jobTitle = req.query.jobTitle;
  if (req.query.jobLocation) filter.jobLocation = req.query.jobLocation;
  if (req.query.seniorityLevel)
    filter.seniorityLevel = req.query.seniorityLevel;
  if (req.query.technicalSkills)
    filter.technicalSkills = req.query.technicalSkills;
  if (req.query.workingTime) filter.workingTime = req.query.workingTime;

  const {
    data: jobs,
    totalCount,
    page: pageNumber,
  } = await pagination({
    page,
    limit,
    sort,
    model: jobModel,
    filter,
  });

  return res
    .status(200)
    .json({ message: "done", totalCount, pageNumber, jobs });
});

// ************************getApplications**************************
export const getApplications = asyncHandler(async (req, res, next) => {
  const { jobId: _id } = req.params;
  const { page, limit, sort } = req.query;

  const populate = [{ path: "applications", populate: { path: "userId" } }];

  const {
    data: applications,
    totalCount,
    page: pageNumber,
  } = await pagination({
    page,
    limit,
    sort,
    model: jobModel,
    populate,
    filter: { _id, closed: false },
  });

  return res
    .status(200)
    .json({ message: "done", totalCount, pageNumber, applications });
});

// ************************applyToJob**************************
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { _id: userId } = req.user;

  const job = await jobModel.findOne({ _id: jobId, closed: false });

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  if (await applicationModel.findOne({ jobId, userId })) {
    return next(new AppError("You have already applied", 400));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/applications",
      resource_type: "auto",
    }
  );

  const application = await applicationModel.create({
    jobId,
    userId,
    userCV: { secure_url, public_id },
  });

  // Emit a socket event to notify the HR that a new application has been submitted
  const io = req.app.get("io");

  io.to(job.companyId.toString()).emit("newApplication", {
    message: `New application has been submitted`,
    applicationId: application._id,
    applicant: req.user.email,
  });

  return res.status(201).json({ message: "done", application });
});

// ************************appStatus**************************
export const appStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const application = await applicationModel
    .findOne({
      _id: applicationId,
      status: { $nin: [statusTypes.accepted, statusTypes.rejected] },
    })
    .populate([{ path: "userId", select: "email" }]);

  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  application.status = status;
  application.save();

  eventEmitter.emit("jobApplication", {
    email: application.userId.email,
    status,
  });

  return res.status(201).json({ message: "done" });
});
