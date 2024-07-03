import { Type } from '@nestjs/common';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

interface ListDtoParams<F, O> {
  filterRef?: Type<F>;
  orderByRef?: Type<O>;
}

export const ListDto = <F, O>(params?: ListDtoParams<F, O>) => {
  const { filterRef, orderByRef } = params ?? {};

  class ListDto {
    @ApiPropertyOptional({ default: 1, description: 'Current page' })
    curPage?: number;

    @ApiPropertyOptional({ default: 10, description: 'Items per page' })
    perPage?: number;
  }

  return IntersectionType(ListDto, filterRef || ListDto, orderByRef || ListDto);
};
