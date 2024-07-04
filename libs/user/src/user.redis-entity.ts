import { PrimaryKey, RedisEntity } from '@argotools/redis-client';

import { IUser } from './interfaces/user.interface';

@RedisEntity({
  keyPrefix: 'user',
  ttlMilliseconds: 1_800_000,
})
export class UserRedisEntity implements IUser {
  @PrimaryKey()
  id: string;

  name: string;

  email: string;

  password: string;

  status: boolean;

  createdAt: Date;

  updatedAt: Date;
}
