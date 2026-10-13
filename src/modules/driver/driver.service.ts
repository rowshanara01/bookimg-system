import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/AppError";
import { DriverAvailability, DriverStatus, IDriver } from "./driver.type";
import { User } from "../user/user.model";
import { Driver } from "./driver.model";
import { Role } from "../user/user.type";
import { Ride } from "../ride/ride.model";
import { RideStatus } from "../ride/ride.type";

export const driverService = {
  addDriverInfo: async (payload: IDriver, userId: string) => {
    const { licenseNumber } = payload;
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
    }
    if (user.role !== Role.DRIVER) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User role must be driver");
    }
    const driverExist = await Driver.findById(userId);
    if (driverExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Driver all ready exist");
    }
    const license = await Driver.findOne({ licenseNumber });
    if (license) {
      throw new AppError(StatusCodes.BAD_REQUEST, "License already exist");
    }
    const driver = await Driver.create({ ...payload, userId });
    return driver;
  },

  approveDriver: async (userId: string) => {
    const driver = await Driver.findOne({ userId });
    if (!driver) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Driver not found");
    }

    driver.status = DriverStatus.Approved;
    await driver.save();

    return driver;
  },

  getCompletedRides: async (driverId: string) => {
    const rides = await Ride.find({
      status: RideStatus.Completed,
      driverId,
    }).sort({ createdAt: -1 });
    const completedRides = rides.length;
    return {
      data: rides,
      meta: {
        total: completedRides,
      },
    };
  },

  updateAvailabilityToOnline: async (userId: string) => {
    const driver = await Driver.findOne({ userId });
    if (!driver) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Driver not found");
    }

    driver.availability = DriverAvailability.Online;
    await driver.save();

    return driver;
  },

  updateAvailabilityToOffline: async (userId: string) => {
    const driver = await Driver.findOne({ userId });
    if (!driver) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Driver not found");
    }

    driver.availability = DriverAvailability.Offline;
    await driver.save();

    return driver;
  },

  suspendDriver: async (driverId: string) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Driver not found");
    }

    driver.status = DriverStatus.Suspended;
    await driver.save();

    return driver;
  },

  getEarnings: async (driverId: string) => {
    const rides = await Ride.find({
      driverId,
      status: "completed",
    });
    const totalEarnings = 200 * rides?.length;

    return totalEarnings;
  },

  getAllDrivers: async () => {
    const drivers = await Driver.find();
    const totalDrivers = await Driver.countDocuments();
    return {
      data: drivers,
      meta: {
        total: totalDrivers,
      },
    };
  },
};
