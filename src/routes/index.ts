import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { usersRoutes } from "../modules/user/user.route";
import { driverRouters } from "../modules/driver/driver.route";
import { rideRouters } from "../modules/ride/ride.route";

export const v1router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: usersRoutes,
  },
  {
    path: "/drivers",
    route: driverRouters,
  },
  {
    path: "/rides",
    route: rideRouters,
  },
];

moduleRoutes.forEach((route) => {
  v1router.use(route.path, route.route);
});
