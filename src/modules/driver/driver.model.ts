import mongoose from "mongoose";
import { DriverAvailability, DriverStatus, IDriver } from "./driver.type";

const driverSchema = new mongoose.Schema<IDriver>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    licenseNumber: { type: String, required: true, unique: true },
    vehicleInfo: {
      type: {
        type: String,
        required: true,
      },
      plate: {
        type: String,
        required: true,
      },
    },
    status: { type: String, enum: Object.values(DriverStatus), default: "pending" },
    availability: { type: String, enum: Object.values(DriverAvailability), default: "offline" },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Driver = mongoose.model("Driver", driverSchema);
