export interface IMongooseMethod {
  comparePassword(realPassword: string): Promise<boolean>;
  //   updateAvailability(): void;
}
