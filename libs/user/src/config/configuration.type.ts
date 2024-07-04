export interface UserModuleOptions {
  hashPassword: (password: string) => string;
  comparePassword: (password: string, hash: string) => boolean;
}

export interface UserModuleOptionsFactory {
  createUserModuleOptions(): UserModuleOptions | Promise<UserModuleOptions>;
}
