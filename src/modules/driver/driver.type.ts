import { Types } from "mongoose";

export enum DriverStatus {
  Pending = "pending",
  Approved = "approved",
  Suspended = "suspended",
}

export enum DriverAvailability {
  Online = "online",
  Offline = "offline",
}

export interface IDriver {
  userId: Types.ObjectId;
  licenseNumber: string;
  vehicleInfo: {
    type: string;
    plate: string;
  };
  status?: DriverStatus;
  availability?: DriverAvailability;
  createdAt?: Date;
  updatedAt?: Date;
}
