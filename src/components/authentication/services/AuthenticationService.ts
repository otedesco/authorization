import {
  Account,
  SecuredAccount,
} from "@components/account/interfaces/Account";
import AccountService from "@components/account/services/AccountService";
import ProfileService from "@components/profile/services/ProfileService";
import {
  REFRESH_PUBLIC_KEY,
  REFRESH_SECRET_KEY,
  SECRET_KEY,
  SESSION_EXPIRE,
  TOKEN_EXPIRE,
} from "@configs/AppConfig";
import { UnauthorizedException } from "@exceptions/UnauthorizedException";
import { sign, verify } from "@otedesco/commons";
import { Transaction as Transactional } from "@utils/Transaction";
import _ from "lodash";
import { Transaction } from "objection";

import { SignIn } from "../interfaces/SignIn";
import { SignUp } from "../interfaces/SignUp";

const tokenSub: keyof Account = "email";

function transactionalCreate(payload: SignUp, returning = false) {
  const accountToCreate = _.omit(payload, [
    "passwordConfirmation",
    "name",
    "lastName",
  ]);
  const profileToCreate = _.pick(payload, ["name", "lastName"]);

  return async (tx: Transaction) => {
    const account = await AccountService.create(accountToCreate, tx);
    const profile = await ProfileService.create(
      { ...profileToCreate, account: account.id },
      tx,
    );
    if (returning) return { account, profiles: [profile] };
  };
}

async function signSession(handler: Promise<SecuredAccount | null>) {
  const account = await handler;
  if (!account) throw new UnauthorizedException();

  const payload = _.pick(account, tokenSub);

  return {
    accessToken: sign(payload, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` }),
    refreshToken: sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: `${SESSION_EXPIRE}s`,
    }),
  };
}

async function signUp(payload: SignUp): Promise<Account> {
  return Transactional.run(transactionalCreate(payload));
}

function signIn(payload: SignIn) {
  return signSession(AccountService.verifyAccount(payload));
}

async function refreshToken(token: string) {
  if (!token) throw new UnauthorizedException();

  return signSession(AccountService.findOne(verify(token, REFRESH_PUBLIC_KEY)));
}

export default { signUp, signIn, refreshToken };
