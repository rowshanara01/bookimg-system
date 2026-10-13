import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IUser, Role } from "../modules/user/user.type";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create  Admin...");

    const payload: IUser = {
      name: " admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: envVars.ADMIN_PASSWORD,
      isBlocked: false,
    };

    const admin = await User.create(payload);
    console.log(" Admin Created Successfully! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
