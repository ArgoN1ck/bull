import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginatedResponseDto } from '../dtos';

type ApiResponseParams = ApiResponseOptions & {
  title: string;
};

export const ApiPaginatedResponse = <Dto extends { new (...args: any): any }>(
  dto: Dto,
  params: ApiResponseParams
) => {
  const { title, ...options } = params;
  const status = options?.status ?? HttpStatus.OK;

  return applyDecorators(
    ApiExtraModels(dto, PaginatedResponseDto),
    HttpCode(+status),
    ApiOkResponse({
      ...options,
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                items: {
                  $ref: getSchemaPath(dto),
                },
                type: 'array',
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
