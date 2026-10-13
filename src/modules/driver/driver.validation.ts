import z from "zod";
import { DriverAvailability, DriverStatus } from "./driver.type";

export const AddDriverInfoZodSchema = z.object({
  // userId: z.instanceof(Types.ObjectId, { message: "Invalid User ID" }),
  licenseNumber: z.string().min(3, "License number is required"),
  vehicleInfo: z.object({
    type: z.string().min(3, "Vehicle type is required"),
    plate: z.string().min(3, "Plate number is required"),
  }),
  availability: z
    .enum(Object.values(DriverAvailability) as [string])
    .optional()
    .default(DriverAvailability.Offline),
});

export const UpdateDriverInfoZodSchema = z.object({
  // userId: z.instanceof(Types.ObjectId, { message: "Invalid User ID" }),
  licenseNumber: z.string().min(3, "License number is required"),
  vehicleInfo: z.object({
    type: z.string().min(3, "Vehicle type is required"),
    plate: z.string().min(3, "Plate number is required"),
  }),
  status: z
    .enum(Object.values(DriverStatus) as [string])
    .optional()
    .default(DriverStatus.Pending),
  availability: z
    .enum(Object.values(DriverAvailability) as [string])
    .optional()
    .default(DriverAvailability.Offline),
  // totalEarnings: z.number().min(0).optional().default(0),
});
