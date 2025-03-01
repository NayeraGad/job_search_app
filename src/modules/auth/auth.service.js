import { OAuth2Client } from "google-auth-library";
import cron from "node-cron";
import { userModel } from "../../DB/models/userModel.js";
import {
  AppError,
  asyncHandler,
  checkOTP,
  Compare,
  eventEmitter,
  generateToken,
  otpTypes,
  providerTypes,
  roleTypes,
} from "../../utilities/index.js";

// ************************signup**************************
export const signup = asyncHandler(async (req, res, next) => {
  if (await userModel.findOne({ email: req.body.email })) {
    return next(new AppError("Email already exists", 409));
  }

  // Formate date
  req.body.dob = new Date(req.body.dob).toLocaleDateString("en-CA");

  const user = await userModel.create({
    ...req.body,
  });

  // Send OTP
  eventEmitter.emit("confirmEmail", { email: req.body.email });

  return res.status(201).json({ message: "done", user });
});

// ************************confirmOTP**************************
export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await userModel.findOne({
    email,
    deletedAt: { $exists: false },
    bannedAt: { $exists: false },
    isConfirmed: false,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = await checkOTP({
    otpArray: user.otp,
    type: otpTypes.confirmEmail,
    code,
  });

  await userModel.updateOne(
    { email },
    {
      isConfirmed: true,
      $pull: { otp: { code: otp.code } },
    }
  );

  return res.status(200).json({ message: "done" });
});

// ************************signin**************************
export const signin = asyncHandler(async (req, res, next) => {
  const { email, _id, password: hashPassword, role, provider } = req.user;
  const { password } = req.body;

  if (provider === providerTypes.google)
    return next(new AppError("Please login with Google", 400));

  // Check password
  if (!(await Compare({ key: password, hashed: hashPassword }))) {
    return next(new AppError("Incorrect password", 400));
  }

  // Generate tokens
  const refresh_token = await generateToken({
    payload: { email, id: _id },
    SIGNATURE:
      role === roleTypes.user
        ? process.env.SIGNATURE_REFRESH_USER
        : process.env.SIGNATURE_REFRESH_ADMIN,
    options: { expiresIn: "7d" },
  });

  const access_token = await generateToken({
    payload: { email, id: _id },
    SIGNATURE:
      role === roleTypes.user
        ? process.env.SIGNATURE_ACCESS_USER
        : process.env.SIGNATURE_ACCESS_ADMIN,
    options: { expiresIn: "1d" },
  });

  return res
    .status(200)
    .json({ message: "done", token: { access_token, refresh_token } });
});

//  ************************signupWithGoogle**************************
export const signupWithGoogle = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  // Verify token
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email, email_verified, given_name, family_name, picture } =
    await verify();

  let user = await userModel.findOne({ email });

  // Create new user if user does not exist
  if (!user) {
    user = await userModel.create({
      firstName: given_name,
      lastName: family_name,
      email,
      isConfirmed: email_verified,
      profilePic: {
        secure_url: picture,
        public_id: "",
      },
      provider: providerTypes.google,
    });
  }

  if (user.provider !== providerTypes.google) {
    return next(new AppError("Please login within system", 400));
  }

  const refresh_token = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:
      user.role === roleTypes.user
        ? process.env.SIGNATURE_REFRESH_USER
        : process.env.SIGNATURE_REFRESH_ADMIN,
    options: { expiresIn: "7d" },
  });

  const access_token = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:
      user.role === roleTypes.user
        ? process.env.SIGNATURE_ACCESS_USER
        : process.env.SIGNATURE_ACCESS_ADMIN,
    options: { expiresIn: "1d" },
  });

  return res
    .status(200)
    .json({ message: "done", token: { access_token, refresh_token } });
});

// ************************forgetPassword**************************
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  eventEmitter.emit("forgetPassword", { email });

  return res.status(200).json({ message: "done" });
});

// ************************resetPassword**************************
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { code, password } = req.body;

  const otp = await checkOTP({
    otpArray: req.user.otp,
    type: otpTypes.forgetPassword,
    code,
  });

  const newOTPArray = req.user.otp.filter((object) => {
    return object.code !== otp.code;
  });

  // Hash password using mongoose hooks
  req.user.password = password;
  (req.user.changeCredentialTime = new Date()),
    (req.user.otp = newOTPArray),
    req.user.save();

  return res.status(200).json({ message: "done" });
});

// ************************refreshToken**************************
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { email, _id, role } = req.user;

  const access_token = await generateToken({
    payload: { email, id: _id },
    SIGNATURE:
      role === roleTypes.user
        ? process.env.SIGNATURE_ACCESS_USER
        : process.env.SIGNATURE_ACCESS_ADMIN,
    options: { expiresIn: "1d" },
  });

  return res.status(200).json({ message: "done", access_token });
});

// ************************taskScheduling**************************
export const taskScheduling = cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("CRON");

    await userModel.updateMany(
      { "otp.expiresIn": { $lt: new Date() } },
      { $pull: { otp: { expiresIn: { $lt: new Date() } } } }
    );
  } catch (error) {
    console.log("Error in CRON", error);
  }
});
