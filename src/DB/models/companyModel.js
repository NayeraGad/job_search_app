import mongoose from "mongoose";
import { extensionTypes, isValidExtension } from "../../utilities/index.js";
import { jobModel } from "./index.js";

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfEmployees: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value > this.numberOfEmployees.min;
          },
          message: "must be range such as 11-20 employee",
        },
      },
    },
    companyEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: {
      secure_url: {
        type: String,
        required: true,
        validate: {
          // Validate file extension, only PDF or image allowed
          validator: function (value) {
            return isValidExtension(value, [
              ...extensionTypes.file,
              ...extensionTypes.image,
            ]);
          },
          message: "must be pdf or image",
        },
      },
      public_id: { type: String, required: true },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const companyId = this._id;

    await jobModel.updateMany({ addedBy: companyId }, { closed: true });

    next();
  }
);

export const companyModel =
  mongoose.models.Company || mongoose.model("Company", companySchema);
