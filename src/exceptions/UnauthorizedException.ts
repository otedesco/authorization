import { UnauthorizedError, CustomError } from '@otedesco/commons';

export class UnauthorizedException extends Error implements CustomError {
  public status: number;

  public code: string;

  public message: string;

  public data: Object | null;

  constructor(properties?: { status: 401; code: string; data: Object }) {
    const { status = 401, code = UnauthorizedError.code, data = null } = properties || {};
    super(UnauthorizedError.code);
    this.status = status;
    this.code = code;
    this.message = UnauthorizedError.message;
    this.data = data;
  }
}
