import { Types } from "mongoose";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  PickedUp = "picked_up",
  InTransit = "in_transit",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | null;
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  status?: RideStatus;
  timestamps?: {
    requestedAt?: Date | null;
    acceptedAt?: Date | null;
    pickedUpAt?: Date | null;
    completedAt?: Date | null;
  };
}
