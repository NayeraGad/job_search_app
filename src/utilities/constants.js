// ****************Mongoose schema enum constants********************
export const providerTypes = {
  google: "google",
  system: "system",
};

export const genderTypes = {
  male: "male",
  female: "female",
};

export const roleTypes = {
  user: "User",
  admin: "Admin",
};

export const otpTypes = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword",
};

export const jobLocationTypes = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};

export const workingTimeTypes = {
  "part-time": "part-time",
  "full-time": "full-time",
};

export const seniorityLevelTypes = {
  Fresh: "Fresh",
  Junior: "Junior",
  "Mid-Level": "Mid-Level",
  Senior: "Senior",
  "Team-Lead": "Team-Lead",
  CTO: "CTO",
};

export const statusTypes = {
  pending: "pending",
  accepted: "accepted",
  viewed: "viewed",
  "in consideration": "in consideration",
  rejected: "rejected",
};

// ****************File extension constants********************
export const extensionTypes = {
  image: ["png", "jpg", "jpeg", "gif"],
  file: ["pdf"],
};

export const mimeExtensionTypes = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
  file: ["application/pdf"],
};

// ****************Token types constants********************
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};

// ****************Chat constants********************
export const connectionUser = new Map();



