import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import {
  ConflictException,
  CoreException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '../exceptions';
import { ResponseDto } from '../responses/swagger/dtos';
import { isParent } from '../utils';

@Catch()
export class HttpCoreExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpCoreExceptionFilter.name);

  catch(exception: HttpException | Error | CoreException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { code, error, message, status } = httpExceptionFactory(exception);

    this.logger.warn({
      code,
      message,
      error,
      stack: exception.stack,
    });

    const resError = new ResponseDto({
      error: { code, error, message },
      status,
      data: null,
      dto: null,
    });

    res.status(status).json(resError);
  }
}

function httpExceptionFactory(
  exception: HttpException | Error | CoreException
): { code: string | number; error: any; message: string; status: number } {
  let code: string | number;
  let error: any;
  let status: number;
  let message: string;

  if (exception instanceof HttpException) {
    status = exception.getStatus();
    message = (exception.getResponse() as { message: string }).message;
    (code = status), (error = true);
  } else if (isParent(exception, CoreException)) {
    if (exception instanceof ValidationException) {
      code = exception.code;
      error = exception.description;
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof NotFoundException) {
      code = exception.code;
      error = exception.description;
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof ConflictException) {
      code = exception.code;
      error = exception.description;
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      code = exception.code;
      error = exception.description;
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof ForbiddenException) {
      code = exception.code;
      error = exception.description;
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else {
      code = 'INTERNAL_SERVER_ERROR';
      error = [];
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
  } else {
    code = 'INTERNAL_SERVER_ERROR';
    error = [];
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal server error';
  }

  return {
    code,
    error,
    message,
    status,
  };
}
