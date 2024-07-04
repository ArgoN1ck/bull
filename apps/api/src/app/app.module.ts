import { RedisClientModule } from '@argotools/redis-client';
import { HttpCoreExceptionFilter } from '@bull/core/filters';
import { HashingModule } from '@bull/shared/modules/hashing';
import * as entities from '@bull/typeorm/entities';
import { UserModule } from '@bull/user';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { BullConfigService } from './configs/bull/bull.config';
import { PinoLoggerConfiguration } from './configs/pino/pino.config';
import { RedisClientConfigService } from './configs/redis/redis.config';
import { ENTITIES_TOKEN } from './configs/typeorm/entities.token';
import { TypeOrmConfigService } from './configs/typeorm/typeorm.config';
import { UserModuleConfigService } from './configs/user/user.config';
@Module({
  imports: [
    LoggerModule.forRoot(PinoLoggerConfiguration),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      extraProviders: [
        { provide: ENTITIES_TOKEN, useValue: Object.values(entities) },
      ],
    }),
    RedisClientModule.forRootAsync({
      useClass: RedisClientConfigService,
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    HashingModule,
    UserModule.forRootAsync({
      useClass: UserModuleConfigService,
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpCoreExceptionFilter }],
})
export class AppModule {}
