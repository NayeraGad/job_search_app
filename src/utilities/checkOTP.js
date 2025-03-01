import { AppError, Compare } from "./index.js";

export const checkOTP = async ({ otpArray, type, code }) => {  
  const otp = otpArray.find((otp) => {
    return otp.otpType === type;
  });

  if (!otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (new Date() > otp.expiresIn) {
    throw new AppError("OTP has expired", 400);
  }

  const isMatch = await Compare({ key: code, hashed: otp.code });

  if (!isMatch) throw new AppError("Invalid OTP", 400);

  return otp;
};
