import { Router } from "express";
import {
  authentication,
  checkEmail,
  validation,
} from "../../middleware/index.js";
import * as authSchema from "./auth.validation.js";
import * as authService from "./auth.service.js";
import { tokenTypes } from "../../utilities/index.js";

const authRouter = Router();

// 1. Sign Up
authRouter.post(
  "/signup",
  validation(authSchema.signupSchema),
  authService.signup
);

// 2. confirm OTP
authRouter.patch(
  "/confirmOTP",
  validation(authSchema.confirmOTPSchema),
  authService.confirmOTP
);

// 3. Sign In (only system provider)
authRouter.post(
  "/signin",
  validation(authSchema.signinSchema),
  checkEmail,
  authService.signin
);

// 4. signup with google
authRouter.post(
  "/signupWithGoogle",
  validation(authSchema.signupWithGoogleSchema),
  authService.signupWithGoogle
);

// 5. Login with google
authRouter.post(
  "/loginWithGmail",
  validation(authSchema.signupWithGoogleSchema),
  authService.signupWithGoogle
);

// 6. Send OTP for Forget password
authRouter.post(
  "/forgetPassword",
  validation(authSchema.forgetPasswordSchema),
  checkEmail,
  authService.forgetPassword
);

// 7. Reset password
authRouter.patch(
  "/resetPassword",
  validation(authSchema.resetPasswordSchema),
  checkEmail,
  authService.resetPassword
);

// 8. Refresh token
authRouter.get(
  "/refreshToken",
  authentication(tokenTypes.refresh),
  authService.refreshToken
);

export default authRouter;
