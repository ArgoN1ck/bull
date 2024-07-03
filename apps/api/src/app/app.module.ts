import { RedisClientModule } from '@argotools/redis-client';
import { HttpCoreExceptionFilter } from '@bull/core/filters';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { PinoLoggerConfiguration } from './configs/pino/pino.config';
import { RedisClientConfigService } from './configs/redis/redis.config';
import { ENTITIES_TOKEN } from './configs/typeorm/entities.token';
import { TypeOrmConfigService } from './configs/typeorm/typeorm.config';

@Module({
  imports: [
    LoggerModule.forRoot(PinoLoggerConfiguration),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      extraProviders: [
        { provide: ENTITIES_TOKEN, useValue: Object.values([]) },
      ],
    }),
    RedisClientModule.forRootAsync({
      useClass: RedisClientConfigService,
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpCoreExceptionFilter }],
})
export class AppModule {}
