import { userModel } from "../../DB/models/userModel.js";
import {
  AppError,
  asyncHandler,
  cloudinary,
  Compare,
  providerTypes,
} from "../../utilities/index.js";

// ************************updateUserAccount**************************
export const updateUserAccount = asyncHandler(async (req, res, next) => {
  req.body.firstName && (req.user.firstName = req.body.firstName);
  req.body.lastName && (req.user.lastName = req.body.lastName);
  req.body.dob && (req.user.dob = req.body.dob);
  req.body.mobileNumber && (req.user.mobileNumber = req.body.mobileNumber);

  req.user.save();

  return res.status(200).json({ message: "done", user: req.user });
});

// ************************getAccount**************************
export const getAccount = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: "done", user: req.user });
});

// ************************getProfile**************************
export const getProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  let user = await userModel.findOne({
    _id: userId,
    deletedAt: { $exists: false },
    bannedAt: { $exists: false },
  });

  user = {
    username: user.username,
    mobileNumber: user.mobileNumber,
    profilePic: user.profilePic.secure_url,
    coverPic: user.coverPic.secure_url,
  };

  if (!user) return next(new AppError("User not found", 404));

  return res.status(200).json({ message: "done", user });
});

// ************************updatePassword**************************
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (req.user.provider === providerTypes.google) {
    return next(
      new AppError(
        "You are authenticated with google, you cannot change password"
      )
    );
  }

  if (!(await Compare({ key: oldPassword, hashed: req.user.password }))) {
    return next(new AppError("Incorrect password", 400));
  }

  req.user.password = newPassword;
  req.user.save();

  return res.status(200).json({ message: "done" });
});

// ************************uploadProfilePic**************************
export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  const { profilePic, _id } = req.user;

  if (profilePic?.secure_url && profilePic?.public_id) {
    await cloudinary.uploader.destroy(profilePic?.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/users/profile",
    }
  );

  const user = await userModel.findByIdAndUpdate(
    _id,
    {
      profilePic: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", user });
});

// ************************uploadCoverPic**************************
export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  const { coverPic, _id } = req.user;

  if (coverPic?.secure_url && coverPic?.public_id) {
    await cloudinary.uploader.destroy(coverPic?.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "job_search_app/users/cover",
    }
  );

  const user = await userModel.findByIdAndUpdate(
    _id,
    {
      coverPic: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", user });
});

// ************************deleteProfilePic**************************
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const { profilePic, _id, provider } = req.user;

  if (!profilePic.secure_url) {
    return next(new AppError("Profile picture not found", 404));
  }

  if (!profilePic.public_id && provider === providerTypes.google) {
    return next(
      new AppError("Profile picture from Google cannot be deleted", 400)
    );
  }

  await cloudinary.uploader.destroy(profilePic.public_id);

  await userModel.updateOne({ _id }, { $unset: { profilePic: true } });

  return res.status(200).json({ message: "done" });
});

// ************************deleteCoverPic**************************
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const { coverPic, _id } = req.user;

  if (!coverPic.secure_url) {
    return next(new AppError("Cover picture not found", 404));
  }

  await cloudinary.uploader.destroy(coverPic.public_id);

  await userModel.updateOne({ _id }, { coverPic: { $unset: 0 } });

  return res.status(200).json({ message: "done" });
});

// ************************softDelete**************************
export const softDelete = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  await userModel.updateOne({ _id }, { deletedAt: new Date(), updatedBy: _id });

  return res.status(200).json({ message: "done" });
});
