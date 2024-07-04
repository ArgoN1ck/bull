import { HashingService } from '@bull/shared/modules/hashing';
import { UserModuleOptions, UserModuleOptionsFactory } from '@bull/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModuleConfigService implements UserModuleOptionsFactory {
  constructor(private hashingService: HashingService) {}

  async createUserModuleOptions(): Promise<UserModuleOptions> {
    return {
      hashPassword: (password) => this.hashingService.hashPassword(password),
      comparePassword: (password, hash) =>
        this.hashingService.compare(password, hash),
    };
  }
}
