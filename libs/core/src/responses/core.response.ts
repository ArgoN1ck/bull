import { HttpStatus, Type } from '@nestjs/common';

export interface IResponseError {
  code: string | number;
  message: string;
  error: string | object;
}

export interface IResponse<Dto> {
  data: Dto | null;
  dto: Type<Dto> | null;
  status?: HttpStatus;
  error?: IResponseError | null;
}

export interface IPaginatedResponse<Dto> {
  data: Dto[] | null;
  dto: Type<Dto> | null;
  meta: IPaginationMeta;
  error?: IResponseError | null;
  status?: HttpStatus;
}

export interface IPaginationMeta {
  curPage: number;

  perPage: number;

  total: number;
}

/**
 * Represents the parameters used for pagination.
 * Implement this interface to define the pagination parameters for your application.
 *
 * @template Filter - The type used for filtering the data during pagination.
 * @template OrderBy - The type used for specifying the ordering of the data during pagination.
 */
export interface IPaginationParams<
  Filter = null,
  OrderBy extends {
    field?: unknown;
    order?: OrderEnum;
  } = {
    field?: unknown;
    order?: OrderEnum;
  }
> extends Partial<Pick<IPaginationMeta, 'curPage' | 'perPage'>> {
  filter?: Filter;
  orderBy?: OrderBy;
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
