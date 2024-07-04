import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID } from 'class-validator';

import { IUser } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'ArgoNick', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'argonick@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strong_secret', description: 'User password' })
  @IsString()
  password: string;
}

export class GetUserDto {
  @ApiProperty({
    description: 'User id',
    default: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID('4')
  id: string;
}

class User implements IUser {
  @ApiProperty({
    description: 'User id',
    default: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({ example: 'ArgoNick', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'argonick@gmail.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'strong_secret', description: 'User password' })
  password: string;

  @ApiProperty({ default: 'false', description: 'User status' })
  status: boolean;

  @ApiProperty({
    example: '2024-03-29 10:21:02.810132',
    description: 'User created date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-29 10:21:02.810132',
    description: 'User updated date',
  })
  updatedAt: Date;
}

export class CreateUserResponseData extends User {}
export class GetUserResponseData extends User {}

export class CheckEmailResponseData {
  @ApiProperty({ example: 'false', description: 'Email exists' })
  exists: boolean;
}
