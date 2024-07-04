import { ValidationException } from '@bull/core/exceptions';
import { ApiResponse } from '@bull/core/responses/swagger/decorators';
import { ResponseDto } from '@bull/core/responses/swagger/dtos';
import { Result } from '@bull/core/types';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CheckEmailResponseData,
  CreateUserDto,
  CreateUserResponseData,
  GetUserDto,
  GetUserResponseData,
} from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse(GetUserResponseData, { title: 'GetUserResponse' })
  @ApiOperation({ operationId: 'getUserById' })
  @Get('get-user-by-id/:id')
  async getUserById(@Param() param: GetUserDto) {
    const result = await this.userService.findOne(param);

    if (result.isFailure)
      return Result.Failure(
        new ValidationException(400, 'ERR_USER_NOT_FOUND')
      ).toProblemDetails();

    return new ResponseDto({ dto: GetUserResponseData, data: result.data });
  }

  @ApiResponse(CreateUserResponseData, {
    title: 'CreateUserResponse',
    status: HttpStatus.CREATED,
  })
  @ApiOperation({ operationId: 'create' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const result = await this.userService.create(dto);

    if (result.isFailure) result.toProblemDetails();

    return new ResponseDto({
      dto: CreateUserResponseData,
      data: result.data,
      status: HttpStatus.CREATED,
    });
  }

  @ApiResponse(CheckEmailResponseData, { title: 'CheckEmailResponse' })
  @ApiOperation({ operationId: 'checkEmail' })
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    const result = await this.userService.emailExists(email);

    if (result.isFailure) result.toProblemDetails();

    return new ResponseDto({
      dto: CheckEmailResponseData,
      data: { exists: false },
    });
  }
}
