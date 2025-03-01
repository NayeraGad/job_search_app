import { userModel } from "../DB/models/userModel.js";
import { AppError, asyncHandler, providerTypes } from "../utilities/index.js";

export const checkEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({
    email,
    isConfirmed: true,
    provider: providerTypes.system,
    deletedAt: { $exists: false },
    bannedAt: { $exists: false },
  });

  if (!user) return next(new AppError("User not found", 404));

  req.user = user;

  next();
});
