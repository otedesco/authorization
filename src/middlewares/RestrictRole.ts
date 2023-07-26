import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { ForbiddenException } from '../exceptions/ForbiddenException';

export const roles =
  (...allowedRoles: string[]) =>
    (_req: Request, { locals }: Response, next: NextFunction) => {
      const role = _.get(locals, 'account.profile.role');
      if (!allowedRoles.includes(role)) {
        return next(new ForbiddenException());
      }

      next();
    };
