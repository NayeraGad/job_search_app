import { Router } from "express";
import {
  authentication,
  multerCloud,
  validation,
} from "../../middleware/index.js";
import { mimeExtensionTypes, tokenTypes } from "../../utilities/index.js";
import * as userValidation from "./users.validation.js";
import * as userService from "./users.service.js";

const userRouter = Router();

// 1. Update user account.
userRouter.patch(
  "/updateAccount",
  validation(userValidation.updateUserAccountSchema),
  authentication(),
  userService.updateUserAccount
);

// 2. Get login user account data
userRouter.get("/getAccount", authentication(), userService.getAccount);

// 3. Get profile data for another user
userRouter.get(
  "/getProfile/:userId",
  validation(userValidation.getProfileSchema),
  authentication(),
  userService.getProfile
);

// 4. Update password
userRouter.patch(
  "/updatePassword",
  validation(userValidation.updatePasswordSchema),
  authentication(),
  userService.updatePassword
);

// 5. Upload Profile Pic
userRouter.patch(
  "/uploadProfilePic",
  multerCloud(mimeExtensionTypes.image).single("profilePic"),
  validation(userValidation.uploadPicSchema),
  authentication(),
  userService.uploadProfilePic
);

// 6. Upload Cover Pic
userRouter.patch(
  "/uploadCoverPic",
  multerCloud(mimeExtensionTypes.image).single("coverPic"),
  validation(userValidation.uploadPicSchema),
  authentication(),
  userService.uploadCoverPic
);

// 7. Delete Profile Pic
userRouter.patch(
  "/deleteProfilePic",
  authentication(),
  userService.deleteProfilePic
);

// 8. Delete Cover Pic
userRouter.patch(
  "/deleteCoverPic",
  authentication(),
  userService.deleteCoverPic
);

// 9. Soft delete account
userRouter.delete("/softDelete", authentication(), userService.softDelete);

export default userRouter;
