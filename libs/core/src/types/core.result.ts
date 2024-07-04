import { CoreException } from '../exceptions/core.exception';

export class Result<T> {
  public get isFailure() {
    return !this.isSuccess;
  }

  private constructor(
    public data: T,
    public isSuccess: boolean,
    public error: CoreException | null
  ) {}

  public static Success<T>(data: T) {
    return new Result(data, true, null);
  }

  public static Failure<E extends CoreException>(error: E) {
    return new Result(null, false, error);
  }

  public toProblemDetails() {
    if (this.error) throw this.error;
  }
}
