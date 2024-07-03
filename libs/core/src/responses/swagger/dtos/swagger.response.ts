import { hasConstructor } from '@bull/core/utils';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import {
  IPaginatedResponse,
  IPaginationMeta,
  IResponse,
  IResponseError,
} from '../../core.response';

class ResponseError {
  @ApiProperty({
    oneOf: [{ type: 'string', default: 'ERROR_CODE' }, { type: 'number' }],
  })
  code: string | number;

  @ApiProperty({ type: 'string', default: 'Error message' })
  message: string;

  @ApiProperty({
    oneOf: [{ type: 'string', default: 'Error reason' }, { type: 'object' }],
  })
  error: string | object;

  constructor(params: IResponseError) {
    const { message, code, error } = params;

    this.message = message;
    this.code = code;
    this.error = error;
  }
}

export class ResponseDto<Dto> {
  @ApiProperty({ nullable: true })
  data: Dto | null;

  @ApiProperty({ type: ResponseError, nullable: true, default: null })
  error: ResponseError | null;

  @ApiProperty({
    enum: HttpStatus,
    enumName: 'HttpStatus',
    default: HttpStatus.OK,
  })
  status: HttpStatus;

  constructor(params: IResponse<Dto>) {
    const { data, error = null, status = HttpStatus.OK, dto } = params;

    if (data) {
      this.data = dto
        ? hasConstructor(dto)
          ? new dto(data)
          : plainToInstance(dto, data)
        : null;
    } else {
      this.data = null;
    }

    this.status = status;
    this.error = error && data == null ? new ResponseError(error) : null;
  }
}

export class PaginatedResponseMeta {
  @ApiProperty()
  curPage: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  total: number;

  constructor(params: IPaginationMeta) {
    const { curPage, perPage, total } = params;

    this.curPage = curPage;
    this.perPage = perPage;
    this.total = total;
  }
}

export class PaginatedResponseDto<Dto> {
  @ApiProperty({ nullable: true })
  data: Dto[] | null;

  @ApiProperty({ type: PaginatedResponseMeta, nullable: true })
  meta: PaginatedResponseMeta;

  @ApiProperty({
    enum: HttpStatus,
    enumName: 'HttpStatus',
    default: HttpStatus.OK,
  })
  status: HttpStatus;

  @ApiProperty({ type: ResponseError, nullable: true, default: null })
  error: ResponseError | null;

  constructor(params: IPaginatedResponse<Dto>) {
    const { data, error = null, status = HttpStatus.OK, dto, meta } = params;

    if (data) {
      if (data.length !== 0)
        this.data = dto
          ? hasConstructor(dto)
            ? data?.map((item) => new dto(item))
            : data?.map((item) => plainToInstance(dto, item))
          : null;
      else this.data = [];
    } else {
      this.data = null;
    }
    this.meta = meta;
    this.status = status;
    this.error = error && this.data == null ? new ResponseError(error) : null;
  }
}
