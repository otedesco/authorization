import { BaseException, InternalServerError, NotNullError } from '@otedesco/commons';
import { LoggerFactory } from '@otedesco/server-utils';
import { DBError, NotNullViolationError } from 'objection-db-errors';

const { logger } = LoggerFactory.getInstance(__filename);

// TODO: IMPLEMENT ALL OBJECTION ERRORS

export function DatabaseErrorHandler(err: Error) {
  logger.error(err);
  if (err instanceof NotNullViolationError) {
    return new BaseException({
      message: NotNullError.message,
      code: NotNullError.code,
      data: {
        column: err.column,
        table: err.table,
      },
    });
  }
  if (err instanceof DBError) {
    return new BaseException({
      status: 500,
      message: InternalServerError.message,
      code: InternalServerError.code,
      data: {},
    });
  }

  return {};
}
