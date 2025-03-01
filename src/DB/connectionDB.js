import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connect to database successfully");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
};

export default connectionDB;
