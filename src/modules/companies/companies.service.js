import { companyModel } from "../../DB/models/index.js";
import { AppError, asyncHandler, cloudinary } from "../../utilities/index.js";
import Excel from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ************************addCompany**************************
export const addCompany = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;

  if (
    await companyModel.findOne({
      $or: [
        { companyName: req.body.companyName },
        { companyEmail: req.body.companyEmail },
      ],
    })
  ) {
    return next(new AppError("Company name or email already exists", 400));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/companies/legal_attachment",
      resource_type: "auto",
    }
  );

  const company = await companyModel.create({
    ...req.body,
    CreatedBy: userId,
    legalAttachment: { secure_url, public_id },
  });

  return res.status(201).json({ message: "done", company });
});

// ************************updateCompany**************************
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { _id } = req.company;

  if (
    await companyModel.findOne({
      $or: [
        { companyName: req.body.companyName },
        { companyEmail: req.body.companyEmail },
      ],
    })
  ) {
    return next(new AppError("Company name or email already exists", 400));
  }

  const company = await companyModel.findByIdAndUpdate(
    _id,
    { ...req.body },
    { new: true }
  );

  return res.status(201).json({ message: "done", company });
});

// ************************deleteCompany**************************
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { _id } = req.company;

  await companyModel.updateOne({ _id }, { deletedAt: new Date() });

  return res.status(201).json({ message: "done" });
});

// ************************getCompanyJobs**************************
export const getCompanyJobs = asyncHandler(async (req, res, next) => {
  const { _id } = req.company;

  const company = await companyModel.findById(_id).populate([{ path: "jobs" }]);

  const message = company.jobs.length ? "done" : "No jobs were add yet";

  return res.status(201).json({ message, company });
});

// ************************searchCompany**************************
export const searchCompany = asyncHandler(async (req, res, next) => {
  const { companyName } = req.query;

  const company = await companyModel.findOne({
    companyName,
    bannedAt: { $exists: false },
    deletedAt: { $exists: false },
  });

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  return res.status(201).json({ message: "done", company });
});

// ************************uploadLogo**************************
export const uploadLogo = asyncHandler(async (req, res, next) => {
  let { _id, Logo } = req.company;

  if (Logo?.secure_url) {
    await cloudinary.uploader.destroy(Logo?.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/companies/logos",
    }
  );

  const company = await companyModel.findByIdAndUpdate(
    _id,
    {
      Logo: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", company });
});

// ************************uploadCompCoverPic**************************
export const uploadCompCoverPic = asyncHandler(async (req, res, next) => {
  let { coverPic, _id } = req.company;

  if (coverPic?.secure_url) {
    await cloudinary.uploader.destroy(coverPic?.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/companies/covers",
    }
  );

  const company = await companyModel.findByIdAndUpdate(
    _id,
    {
      coverPic: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", company });
});

// ************************deleteLogo**************************
export const deleteLogo = asyncHandler(async (req, res, next) => {
  const { Logo, _id } = req.company;

  if (!Logo?.secure_url || !Logo?.public_id) {
    return next(new AppError("Picture not found", 404));
  }

  await cloudinary.uploader.destroy(Logo?.public_id);

  await companyModel.updateOne(
    { _id },
    {
      $unset: { Logo: true },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done" });
});

// ************************deleteCompCoverPic**************************
export const deleteCompCoverPic = asyncHandler(async (req, res, next) => {
  const { coverPic, _id } = req.company;

  if (!coverPic?.secure_url || !coverPic?.public_id) {
    return next(new AppError("Picture not found", 404));
  }

  await cloudinary.uploader.destroy(coverPic?.public_id);

  await companyModel.updateOne(
    { _id },
    {
      $unset: { coverPic: true },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done" });
});

// ************************collectApplications**************************
export const collectApplications = asyncHandler(async (req, res, next) => {
  const { _id } = req.company;
  const { date } = req.query;

  const company = await companyModel
    .findById(_id)
    .populate([
      {
        path: "jobs",
        populate: {
          path: "applications",
          select: "-userCV.public_id",
          populate: { path: "userId", select: "email" },
        },
      },
    ])
    .select("jobs");

  const applications = company.jobs
    .map((job) =>
      job.applications
        .filter(
          (app) =>
            new Date(app.createdAt).toDateString() ===
            new Date(date).toDateString()
        )
        .map((app) => ({
          _id: app._id,
          jobId: app.jobId,
          userEmail: app.userId.email,
          userCV: app.userCV.secure_url,
          status: app.status,
          createdAt: app.createdAt,
        }))
    )
    .flat();

  if (!applications.length) {
    return next(
      new AppError("Applications not found for this date or company", 404)
    );
  }

  const workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet("Applications");

  worksheet.columns = [
    { header: "_id", key: "_id", width: 30 },
    { header: "jobId", key: "jobId", width: 30 },
    { header: "userEmail", key: "userEmail", width: 35 },
    { header: "userCV", key: "userCV", width: 50 },
    { header: "status", key: "status", width: 20 },
    { header: "createdAt", key: "createdAt", width: 20 },
  ];

  applications.forEach((app) => worksheet.addRow(app));

  const filePath = path.join(__dirname, "applications.xlsx");

  await workbook.xlsx.writeFile(filePath);

  res.download(filePath, "applications.xlsx", (err) => {
    if (err) {
      return res.status(500).json({ message: "Error generating Excel file." });
    }
    fs.unlinkSync(filePath);
  });
});
