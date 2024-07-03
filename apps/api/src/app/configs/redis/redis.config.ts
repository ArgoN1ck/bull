import {
  RedisClientModuleOptions,
  RedisClientModuleOptionsFactory,
} from '@argotools/redis-client';
import { Injectable } from '@nestjs/common';

import { environment } from '../../../environment/environment';

@Injectable()
export class RedisClientConfigService
  implements RedisClientModuleOptionsFactory
{
  createRedisClientModuleOptions(): RedisClientModuleOptions {
    return {
      config: {
        host: environment.redis.host,
        port: environment.redis.port,
      },
    };
  }
}
