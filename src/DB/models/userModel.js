import mongoose from "mongoose";
import {
  AppError,
  Decrypt,
  Encrypt,
  genderTypes,
  Hash,
  isValidDOB,
  otpTypes,
  providerTypes,
  roleTypes,
} from "../../utilities/index.js";
import { companyModel } from "./index.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
    },
    dob: {
      type: Date,
      validate: {
        validator: function (value) {
          const { isValid, message } = isValidDOB(value);

          if (!isValid) throw new AppError(message, 400);

          return value;
        },
      },
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: Date,
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    otp: [
      {
        code: {
          type: String,
          required: true,
        },
        otpType: {
          type: String,
          enum: Object.values(otpTypes),
          required: true,
        },
        expiresIn: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field username
userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password & encrypt mobile number
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await Hash({ key: this.password });
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = await Encrypt({ key: this.mobileNumber });
  }

  next();
});

// Decrypt mobile number
userSchema.post("findOne", async function (result) {
  if (result?.mobileNumber) {
    result.mobileNumber = await Decrypt({
      key: result.mobileNumber,
      SECRET_KEY: process.env.SECRET_KEY,
    });
  }
});

userSchema.post("find", async function (results) {
  await Promise.all(
    results.map(async (user) => {
      if (user?.mobileNumber) {
        user.mobileNumber = await Decrypt({
          key: user.mobileNumber,
          SECRET_KEY: process.env.SECRET_KEY,
        });
      }
    })
  );
});

userSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;

    const company = await companyModel.findOne({
      $or: [{ CreatedBy: userId }, { HRs: { $in: { userId } } }],
    });

    if(company) {
      // If the user is the company owner delete company and jobs
      if (company.CreatedBy === userId) {
        await companyModel.updateOne(
          { CreatedBy: userId },
          { deletedAt: new Date() }
        );
        await jobModel.updateMany({ addedBy: userId }, { closed: true });
      }

      // If the user was an hr
      if (company.HRs.includes(userId)) {
        await companyModel.updateMany(
          { HRs: userId },
          { $pull: { HRs: userId } }
        );
      }
    }

    next();
  }
);

export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
