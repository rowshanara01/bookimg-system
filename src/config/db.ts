import mongoose from "mongoose";
import { envVars } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(`MongoDB connection failed:${error}`);
    process.exit(1);
  }
};
