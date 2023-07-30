import { validateIncomingData } from "@middlewares/index";
import { Route } from "@otedesco/server-utils";
import { Router } from "express";
import asyncHandler from "express-async-handler";

import AuthenticationController from "../controllers/AuthenticationController";
import { signIn, signUp } from "../validators/AuthenticationValidator";

export class AuthenticationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = "/auth";
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/sign-up`,
      validateIncomingData(signUp),
      asyncHandler(AuthenticationController.signUp),
    );

    this.router.post(
      `${this.path}/sign-in`,
      validateIncomingData(signIn),
      asyncHandler(AuthenticationController.signIn),
    );

    this.router.post(
      `${this.path}/refresh-token`,
      asyncHandler(AuthenticationController.refreshAuthorization),
    );
  }
}
