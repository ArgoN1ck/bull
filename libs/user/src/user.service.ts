import { InjectRedisRepository, Repository } from '@argotools/redis-client';
import {
  UnauthorizedException,
  ValidationException,
} from '@bull/core/exceptions';
import { Result } from '@bull/core/types';
import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';

import { USER_MODULE_OPTIONS } from './config/configuration.module-builder';
import { UserModuleOptions } from './config/configuration.type';
import { IUser } from './interfaces/user.interface';
import {
  CreateUserParams,
  GetUserByEmailParams,
  GetUserParams,
} from './types/user.type';
import { USER_CONFIRMATION_QUEUE } from './user.constants';
import { UserRedisEntity } from './user.redis-entity';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(
    @Inject(USER_MODULE_OPTIONS) private readonly options: UserModuleOptions,
    @InjectQueue(USER_CONFIRMATION_QUEUE)
    private readonly userConfirmationQueue: Queue,
    @InjectRedisRepository(UserRedisEntity)
    private readonly userRedisRepository: Repository<UserRedisEntity>,
    private readonly userRepository: UserRepository
  ) {}

  async create(params: CreateUserParams): Promise<Result<IUser>> {
    const { email, password, name } = params;

    const createResult = await this.userRepository.create({
      id: randomUUID(),
      email,
      name,
      password: this.options.hashPassword(password),
      status: false,
    });

    if (createResult.isFailure) {
      return createResult;
    }

    await this.userConfirmationQueue.add(
      {
        id: createResult.data.id,
      },
      {
        delay: 10_000,
      }
    );

    return createResult;
  }

  async findOne(params: GetUserParams): Promise<Result<IUser>> {
    const userFromCache = await this.userRedisRepository.get({ id: params.id });

    if (userFromCache) return Result.Success(userFromCache);

    const result = await this.userRepository.findOne(params.id);

    if (result.isSuccess) await this.userRedisRepository.set(result.data);

    return result;
  }

  findOneByEmail(params: GetUserByEmailParams): Promise<Result<IUser>> {
    return this.userRepository.findOne(params.email);
  }

  async checkPassword(email: string, password: string): Promise<Result<IUser>> {
    const findOneResult = await this.userRepository.findOneByEmail(email);

    if (findOneResult.isFailure) return findOneResult;

    const result = this.options.comparePassword(
      password,
      findOneResult.data.password
    );

    if (!result)
      return Result.Failure(
        new UnauthorizedException(
          'UNAUTHORIZED',
          'UnauthorizedException',
          'Invalid credentials'
        )
      );

    return Result.Success(findOneResult.data);
  }

  async emailExists(email: string): Promise<Result<boolean>> {
    const result = await this.userRepository.findOneByEmail(email);

    if (result.isSuccess)
      return Result.Failure(
        new ValidationException(
          400,
          'ERR_USER_EMAIL_EXISTS',
          `Email: ${email} already exists`
        )
      );

    return Result.Success(false);
  }

  confirmUser(id: string) {
    return this.userRepository.update(id, { status: true });
  }
}
