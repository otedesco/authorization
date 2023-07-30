import { InternalServerError, CustomError } from "@otedesco/commons";

export class InternalServerException extends Error implements CustomError {
  public status: number;

  public code: string;

  public message: string;

  public data: Object | null;

  constructor(properties?: { status: 500; code: string; data: Object }) {
    const { status = 500, code = InternalServerError.code, data = null } = properties ?? {};
    super(InternalServerError.code);
    this.status = status;
    this.code = code;
    this.message = InternalServerError.message;
    this.data = data;
  }
}
