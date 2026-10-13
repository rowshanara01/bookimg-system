export enum Role {
  ADMIN = "admin",
  DRIVER = "driver",
  RIDER = "rider",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  cancelCount?: number;
  isBlocked?: boolean;
}
