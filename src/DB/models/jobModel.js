import mongoose from "mongoose";
import {
  jobLocationTypes,
  seniorityLevelTypes,
  workingTimeTypes,
} from "../../utilities/index.js";

const jobSchema = mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocationTypes),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimeTypes),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevelTypes),
      required: true,
    },
    jobDescription: {
      type: String,
      trim: true,
      required: true,
    },
    technicalSkills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    softSkills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

export const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
