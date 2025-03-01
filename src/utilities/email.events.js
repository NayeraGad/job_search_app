import { EventEmitter } from "events";
import { customAlphabet } from "nanoid";
import { AppError, Hash, otpTypes, statusTypes } from "./index.js";
import { userModel } from "../DB/models/userModel.js";
import sendEmail from "../services/index.js";
import { html } from "../services/template.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  const { email } = data;

  // Generate OTP
  const code = customAlphabet("0123456789", 5)();

  // hash OTP
  const hash = await Hash({ key: code });

  await userModel.updateOne(
    { email },
    {
      $set: {
        otp: {
          code: hash,
          otpType: otpTypes.confirmEmail,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    }
  );

  const isEmailSent = await sendEmail({
    to: email,
    subject: "Confirm Email",
    html: html({ code, message: "Email Confirmation" }),
  });

  if (!isEmailSent) {
    throw new AppError("Failed to send email");
  }
});

eventEmitter.on("forgetPassword", async (data) => {
  const { email } = data;

  // Generate OTP
  const code = customAlphabet("0123456789", 5)();

  // hash OTP
  const hash = await Hash({ key: code });

  await userModel.updateOne(
    { email },
    {
      $set: {
        otp: {
          code: hash,
          otpType: otpTypes.forgetPassword,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    }
  );

  const isEmailSent = await sendEmail({
    to: email,
    subject: "Forget password",
    html: html({ code, message: "Forget password" }),
  });

  if (!isEmailSent) {
    throw new AppError("Failed to send email");
  }
});

eventEmitter.on("jobApplication", async (data) => {
  const { email, status } = data;

  const isEmailSent = await sendEmail({
    to: email,
    subject: "Job Application",
    text:
      status === statusTypes.accepted
        ? "Congratulations you are Accepted"
        : "Sorry you are rejected",
  });

  if (!isEmailSent) {
    throw new AppError("Failed to send email");
  }
});
