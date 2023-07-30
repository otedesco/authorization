import { verify } from "@otedesco/commons";
import { LoggerFactory } from "@otedesco/server-utils";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

import AccountService from "../components/account/services/AccountService";
import { PUBLIC_KEY, REFRESH_PUBLIC_KEY } from "../configs/AppConfig";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";

const { logger } = LoggerFactory.getInstance(__filename);

function getAccessToken({ headers, cookies }: Request): string | null {
  const authorizationHeader = _.get(headers, "Authorization", null) as string;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer"))
    return authorizationHeader.split(" ")[1];

  const authorizationCookie = _.get(cookies, "access_token", null);
  if (authorizationCookie) return authorizationCookie;

  return null;
}

function getRefreshToken({ cookies }: Request): string | null {
  const refreshToken = _.get(cookies, "refresh_token");

  return refreshToken;
}

export async function deserializeAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info(`Account deserialization attempt ${new Date()} `);
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);
  if (!accessToken && !refreshToken) return next(new UnauthorizedException());

  const publicKey = accessToken
    ? PUBLIC_KEY
    : refreshToken
    ? REFRESH_PUBLIC_KEY
    : null;
  if (!publicKey) return next(new UnauthorizedException());

  const data = verify(accessToken || refreshToken, publicKey);
  if (!data) return next(new UnauthorizedException());

  const account = AccountService.verifyAccount(data);

  logger.info(`Account deserialization success: ${JSON.stringify(data)} `);

  res.locals.account = account;

  return next();
}
