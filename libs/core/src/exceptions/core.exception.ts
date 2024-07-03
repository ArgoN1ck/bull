export interface ICoreException {
  code: string | number;
  message: string;
  description?: string | object;
}

export class CoreException extends Error implements ICoreException {
  constructor(
    public code: string | number,
    public override message: string,
    public description?: string | object
  ) {
    super(message);
  }
}

export class ValidationException extends CoreException {
  constructor(description: object) {
    super(400, 'BadRequestException', description);
  }
}
export class UnauthorizedException extends CoreException {}
export class ForbiddenException extends CoreException {}
export class NotFoundException extends CoreException {}
export class ConflictException extends CoreException {}
export class InternalServerException extends CoreException {}
