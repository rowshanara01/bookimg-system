import { z } from "zod";
import { RideStatus } from "./ride.type";

export const rideRequestValidationSchema = z.object({
  // riderId: z.string({ error: "Invalid Rider ID" }),
  pickup: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(3, "Pickup address is required"),
  }),
  destination: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(3, "Destination address is required"),
  }),
});

export const rideRequestUpdateValidationSchema = z.object({
  // driverId: z.string({ error: "Invalid Driver ID" }),
  status: z.enum(Object.values(RideStatus)),
  timestamps: z
    .object({
      requestedAt: z.date().optional(),
      acceptedAt: z.date().optional(),
      pickedUpAt: z.date().optional(),
      completedAt: z.date().optional(),
    })
    .optional(),
});
