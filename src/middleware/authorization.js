import { roleTypes } from "../utilities/constants.js";
import { AppError, asyncHandler } from "../utilities/errorHandler.js";

export const authorization = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return next(new AppError("Unauthorized", 401));
    }

    return next();
  });
};

export const companyAuthorization = ({
  roles = [],
  owner = false,
  hr = false,
}) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    const company = req.company;

    if (!user || !company) {
      return next(new AppError("Unauthorized", 401));
    }

    if (owner && company.CreatedBy.toString() === user._id.toString()) {
      return next();
    }

    if (hr && company.HRs.includes(user._id)) {
      return next();
    }

    if (roles.includes(user.role)) {
      return next();
    }

    return next(new AppError("Access denied", 403));
  });
};

export const graphqlAuthorization = ({ roles = [roleTypes.admin], user }) => {
  if (!user || !roles.includes(user.role)) {
    throw new AppError("Unauthorized", 401);
  }

  return user;
};
