import { companyModel } from "../DB/models/companyModel.js";
import { AppError, asyncHandler } from "../utilities/index.js";

export const checkCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await companyModel.findOne({
    _id: companyId,
    bannedAt: { $exists: false },
    deletedAt: { $exists: false },
  });

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  req.company = company;

  next();
});
