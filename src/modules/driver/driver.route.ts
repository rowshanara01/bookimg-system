import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.type";
import { driverController } from "./driver.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { AddDriverInfoZodSchema } from "./driver.validation";
import { checkDriverApprove } from "../../middlewares/checkDriverApprove";

const router = Router();

router.post(
  "/add-information",
  validateRequest(AddDriverInfoZodSchema),
  checkAuth(Role.DRIVER),
  driverController.addDriverInfo,
);

router.get("/my-earning", checkAuth(Role.DRIVER), checkDriverApprove, driverController.getEarnings);

router.get(
  "/completed",
  checkAuth(Role.DRIVER),
  checkDriverApprove,
  driverController.getCompletedRides,
);

router.patch(
  "/availability/online",
  checkAuth(Role.DRIVER),
  checkDriverApprove,
  driverController.updateAvailabilityToOnline,
);
router.patch(
  "/availability/offline",
  checkAuth(Role.DRIVER),
  checkDriverApprove,
  driverController.updateAvailabilityToOffline,
);

// admin routes
router.get("/all-drivers", checkAuth(Role.ADMIN), driverController.getAllDrivers);
router.patch("/approve/:id", checkAuth(Role.ADMIN), driverController.approveDriver);
router.patch("/suspend/:id", checkAuth(Role.ADMIN), driverController.suspendDriver);

export const driverRouters = router;
