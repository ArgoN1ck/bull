import { RedisClientModule } from '@argotools/redis-client';
import { HashingModule } from '@bull/shared/modules/hashing';
import { UserEntity } from '@bull/typeorm/entities';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModuleConfigurableModuleClass } from './config/configuration.module-builder';
import { USER_CONFIRMATION_QUEUE } from './user.constants';
import { UserConfirmationConsumer } from './user.consumer';
import { UserController } from './user.controller';
import { UserRedisEntity } from './user.redis-entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisClientModule.forFeature([UserRedisEntity]),
    BullModule.registerQueue({ name: USER_CONFIRMATION_QUEUE }),
    HashingModule,
  ],
  providers: [UserConfirmationConsumer, UserRepository, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule extends UserModuleConfigurableModuleClass {}
