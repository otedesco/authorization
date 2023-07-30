import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "@configs/AppConfig";
import { createResponse } from "@handlers/ResponseHandler";
import { CookieOptions, Request, Response } from "express";
import _ from "lodash";

import { SignIn } from "../interfaces/SignIn";
import { SignUp } from "../interfaces/SignUp";
import AuthenticationService from "../services/AuthenticationService";

async function signUp(req: Request, res: Response): Promise<void> {
  const accountData: SignUp = req.body;
  const { status } = await createResponse(
    AuthenticationService.signUp(accountData),
  );

  res.status(status).send();
}

async function signIn(req: Request, res: Response): Promise<void> {
  const payload: SignIn = req.body;

  const { status, data } = await createResponse(
    AuthenticationService.signIn(payload),
  );

  res.cookie(
    "access_token",
    data.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions,
  );
  res.cookie(
    "refresh_token",
    data.refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS as CookieOptions,
  );
  res.cookie("logged_in", true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json(data);
}

async function signOut(_req: Request, res: Response): Promise<void> {
  // TODO: implement logout logic
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });
  res.cookie("logged_in", "", { maxAge: 1 });

  res.status(200).send();
}

async function refreshAuthorization(
  { cookies }: Request,
  res: Response,
): Promise<void> {
  const refreshToken = _.get(cookies, "refresh_token", null);
  const { status, data } = await createResponse(
    AuthenticationService.refreshToken(refreshToken),
  );

  res.cookie(
    "access_token",
    data.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions,
  );
  res.cookie("logged_in", true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json(data);
}

export default { signUp, signIn, signOut, refreshAuthorization };
