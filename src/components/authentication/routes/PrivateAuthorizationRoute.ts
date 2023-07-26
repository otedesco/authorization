import { deserializeAccount, isPrivate } from '@middlewares/index';
import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';


import AuthenticationController from '../controllers/AuthenticationController';

export class PrivateAuthenticationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/auth';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, isPrivate);
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-out`, asyncHandler(AuthenticationController.signOut));
  }
}
