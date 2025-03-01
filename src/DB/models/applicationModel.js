import mongoose from "mongoose";
import {
  extensionTypes,
  isValidExtension,
  statusTypes,
} from "../../utilities/index.js";

const applicationSchema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: {
      secure_url: {
        type: String,
        required: true,
        validate: {
          // Validate file extension, only PDF allowed
          validator: function (value) {
            return isValidExtension(value, extensionTypes.file);
          },
          message: "must be pdf",
        },
      },
      public_id: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(statusTypes),
      default: statusTypes.pending,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const applicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
