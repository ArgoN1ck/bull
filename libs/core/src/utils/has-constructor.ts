import { Type } from '@nestjs/common';

export function hasConstructor<T>(cls: Type<T>): boolean {
  return !!cls?.prototype?.constructor?.length;
}
