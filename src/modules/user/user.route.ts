import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.type";
import { validateRequest } from "../../middlewares/validationRequest";
import { UpdateUserZodSchema } from "./user.validation";

const router = Router();

router.get("/all-users", checkAuth(Role.ADMIN), userController.getAllUsers);
router.patch(
  "/update-user/:id",
  validateRequest(UpdateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userController.updateUser,
);
router.patch("/block/:id", checkAuth(Role.ADMIN), userController.blockUser);
router.patch("/unblock/:id", checkAuth(Role.ADMIN), userController.unblockUser);

export const usersRoutes = router;
