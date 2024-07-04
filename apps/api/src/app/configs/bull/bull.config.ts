import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { QueueOptions } from 'bull';

import { environment } from '../../../environment/environment';

export class BullConfigService implements SharedBullConfigurationFactory {
  createSharedConfiguration(): QueueOptions | Promise<QueueOptions> {
    return {
      redis: {
        host: environment.redis.host,
        port: environment.redis.port,
      },
    };
  }
}
