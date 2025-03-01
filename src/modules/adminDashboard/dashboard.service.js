import { companyModel, userModel } from "../../DB/models/index.js";
import { AppError, asyncHandler, toggleBan } from "../../utilities/index.js";

// ************************toggleBanUser**************************
export const toggleBanUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const { updatedData: user, message } = await toggleBan({
    model: userModel,
    _id: userId,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await userModel.updateOne({ _id: userId }, { updatedBy: req.user._id });

  return res.status(200).json({ message });
});

// ************************toggleBanCompany**************************
export const toggleBanCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const { updatedData: company, message } = await toggleBan({
    model: companyModel,
    _id: companyId,
  });

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  return res.status(200).json({ message, company });
});

// ************************approveCompany**************************
export const approveCompany = asyncHandler(async (req, res, next) => {
  const { _id, approvedByAdmin } = req.company;

  if (approvedByAdmin) return next(new AppError("Already approved", 400));

  const company = await companyModel.findByIdAndUpdate(
    _id,
    {
      approvedByAdmin: true,
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", company });
});
