/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/AppError";
import { Ride } from "./ride.model";
import { IRide, RideStatus } from "./ride.type";
import { User } from "../user/user.model";
import { ObjectId } from "mongodb";
import { Driver } from "../driver/driver.model";
import { DriverAvailability, DriverStatus } from "../driver/driver.type";
import { Role } from "../user/user.type";

export const rideService = {
  getAllRides: async () => {
    const rides = await Ride.find();
    const totalRides = await Ride.countDocuments();
    return {
      data: rides,
      meta: {
        total: totalRides,
      },
    };
  },

  getRiderHistory: async (riderId: string) => {
    const rides = await Ride.find({ riderId: riderId }).sort({ createdAt: -1 });
    const totalRides = rides.length;
    return {
      data: rides,
      meta: {
        total: totalRides,
      },
    };
  },

  getAvailableRides: async () => {
    const rides = await Ride.find({
      status: RideStatus.Requested,
      driverId: null,
    }).sort({ createdAt: -1 });
    const availableRides = rides.length;
    return {
      data: rides,
      meta: {
        total: availableRides,
      },
    };
  },

  requestRide: async (payload: Partial<IRide>, riderId: string) => {
    const rider = await User.findById(riderId);
    if (!rider) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Rider id is not registered");
    }
    const existingRide = await Ride.findOne({
      riderId: riderId,
      status: RideStatus.Requested,
    });

    if (existingRide) {
      throw new AppError(StatusCodes.CONFLICT, "You already have a pending ride request");
    }
    const availableDrivers = await Driver.find({
      status: DriverStatus.Approved,
      availability: DriverAvailability.Online,
    });
    if (availableDrivers.length === 0) {
      throw new AppError(StatusCodes.LENGTH_REQUIRED, "Drivers not available");
    }

    const ride = await Ride.create({ riderId, ...payload });
    return ride;
  },

  acceptRide: async (rideId: string, driverId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Ride not found");
    }
    if (ride.status !== RideStatus.Requested) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Ride is already accepted");
    }

    const existingRide = await Ride.findOne({
      driverId,
      status: { $in: [RideStatus.Accepted, RideStatus.PickedUp, RideStatus.InTransit] },
    });

    if (existingRide) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Driver is already on another active ride");
    }

    const updatedData = {
      driverId: new ObjectId(driverId),
      status: RideStatus.Accepted,
      timestamps: {
        acceptedAt: new Date(),
      },
    };

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updatedData, { new: true });
    return updatedRide;
  },

  updateRideStatus: async (rideId: string, driverId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Ride not found");
    }

    if (ride.driverId?.toString() !== driverId?.toString()) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "you are not assigned this ride");
    }
    if (ride.status == RideStatus.Requested) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "First accept the ride");
    }
    if (ride.status == RideStatus.Cancelled) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "This ride is cancelled");
    }
    if (ride.status === RideStatus.Completed) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "This ride is already completed");
    }

    const updatedData: Partial<IRide> = { timestamps: { ...ride.timestamps } };
    if (ride.status === RideStatus.Accepted) {
      updatedData.status = RideStatus.PickedUp;
      updatedData.timestamps!.pickedUpAt = new Date();
    }
    if (ride.status === RideStatus.PickedUp) {
      updatedData.status = RideStatus.InTransit;
    }
    if (ride.status === RideStatus.InTransit) {
      updatedData.status = RideStatus.Completed;
      updatedData.timestamps!.completedAt = new Date();
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updatedData, { new: true });
    return updatedRide;
  },

  cancelRide: async (userid: string) => {
    const user = await User.findById(userid);
    const cancelLimit = 10;

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Rider id is not registered");
    }
    if (user.cancelCount! >= cancelLimit) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Maximum cancel attempts reached");
    }
    const roleField = user.role === Role.RIDER ? "riderId" : "driverId";
    const ride = await Ride.findOne({ [roleField]: userid });
    if (!ride) {
      throw new AppError(StatusCodes.FORBIDDEN, "Ride not found");
    }

    if (ride.status === RideStatus.Cancelled) {
      throw new AppError(StatusCodes.FORBIDDEN, "Ride already canceled");
    }

    if (user.role === Role.RIDER && ride.status !== RideStatus.Requested) {
      throw new AppError(StatusCodes.CONFLICT, "Cannot cancel after driver accepts");
    }
    if (user.role === Role.DRIVER) {
      if (ride.status === RideStatus.Requested) {
        throw new AppError(StatusCodes.CONFLICT, "Ride is already in request");
      }
      if (
        [RideStatus.PickedUp, RideStatus.InTransit, RideStatus.Completed].includes(
          ride.status as RideStatus,
        )
      ) {
        throw new AppError(StatusCodes.CONFLICT, "Cannot cancel after ride has started");
      }
      ride.timestamps!.acceptedAt = null;
      ride.driverId = null;
      ride.status = RideStatus.Requested;
    } else {
      ride.status = RideStatus.Cancelled;
    }

    // Increase cancel count
    user.cancelCount = (user.cancelCount || 0) + 1;
    await user.save();
    await ride.save();

    return ride;
  },
};
