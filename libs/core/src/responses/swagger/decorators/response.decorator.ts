import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as ApiResponseLib,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { ResponseDto } from '../dtos';

type ApiResponseParams = ApiResponseOptions & {
  title: string;
};

export const ApiResponse = <Dto extends { new (...args: any): any }>(
  dto: Dto,
  params: ApiResponseParams
) => {
  const { title, ...options } = params;
  const status = options?.status ?? HttpStatus.OK;

  return applyDecorators(
    ApiExtraModels(dto, ResponseDto),
    HttpCode(+status),
    ApiResponseLib({
      ...options,
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dto),
              },
              status: {
                $ref: getSchemaPath('HttpStatus'),
                default: status,
              },
            },
          },
        ],
        title,
      },
    })
  );
};

export const ApiEmptyResponse = (params: ApiResponseParams) => {
  const { title, ...options } = params;
  const status = options?.status ?? HttpStatus.OK;

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    HttpCode(+status),
    ApiResponseLib({
      ...options,
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                nullable: true,
                default: null,
              },
              error: {
                default: null,
              },
              status: {
                default: status,
              },
            },
          },
        ],
        title,
      },
    })
  );
};
