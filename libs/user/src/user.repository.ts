import {
  ConflictException,
  InternalServerException,
  NotFoundException,
} from '@bull/core/exceptions';
import { Result } from '@bull/core/types';
import { UserEntity } from '@bull/typeorm/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(params: Partial<UserEntity>): Promise<Result<UserEntity>> {
    try {
      const user = this.userRepository.create({
        ...params,
      });
      await this.userRepository.save(user);

      return Result.Success(user);
    } catch (err) {
      return Result.Failure(
        new ConflictException(
          'USER_EXISTS',
          'ConflictException',
          'User already exists'
        )
      );
    }
  }

  async findOne(id: string): Promise<Result<UserEntity>> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      return Result.Failure(
        new NotFoundException(
          'ERR_USER_NOT_FOUND',
          'NotFoundException',
          `User with id: ${id} not found`
        )
      );

    return Result.Success(user);
  }

  async findOneByEmail(email: string): Promise<Result<UserEntity>> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      return Result.Failure(
        new NotFoundException(
          'ERR_USER_NOT_FOUND',
          'NotFoundException',
          `User with email: ${email} not found`
        )
      );

    return Result.Success(user);
  }

  async update(id: string, data: Partial<UserEntity>) {
    const result = await this.userRepository.update(id, data);

    if (result.affected === 0) {
      return Result.Failure(
        new InternalServerException(
          'COULDNT_UPDATE_USER',
          'InternalServerException',
          `Please, check if user with id: ${id} exists`
        )
      );
    }

    return Result.Success(result.raw);
  }
}
