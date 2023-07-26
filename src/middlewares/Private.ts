import { LoggerFactory } from '@otedesco/server-utils';
import { NextFunction, Request, Response } from 'express';

import { UnauthorizedException } from '../exceptions/UnauthorizedException';
const { logger } = LoggerFactory.getInstance(__filename);

export const isPrivate = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const account = res.locals.account;
    if (!account) {
      logger.error('No account found');
      
      return next(new UnauthorizedException());
    }

    return next();
  } catch (err: any) {
    return next(err);
  }
};
