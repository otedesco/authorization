import { SALT_ROUNDS } from "@configs/AppConfig";
import { AccountConfig } from "@configs/KafkaConfig";
import { AccountStatusEnum } from "@enums/AccountStatusEnum";
import { UnauthorizedException } from "@exceptions/UnauthorizedException";
import { ValidationException } from "@exceptions/ValidationException";
import { generateHash, compareWithHash } from "@otedesco/commons";
import { notify } from "@otedesco/notify";
import _ from "lodash";
import { Transaction } from "objection";

import { Account, SecuredAccount } from "../interfaces/Account";
import CachedAccountRepository from "../repositories/CachedAccountRepository";

async function sanitize(handler: Promise<Account>): Promise<SecuredAccount> {
  const keysToOmit = ["password", "salt"];
  const account = await handler;

  return _.omit(account, keysToOmit) as SecuredAccount;
}

async function validateAccount({ email, externalAuthType, externalId, password }: Partial<Account>): Promise<void> {
  if (!externalAuthType && !password) throw new ValidationException({ status: 400 });
  if (externalAuthType && !externalId) throw new ValidationException({ status: 400 });

  const account = await CachedAccountRepository.findOne({ email });
  if (account) throw new ValidationException({ status: 400 });
}

async function mapAccountData(account: Account): Promise<Account> {
  const accountData = {
    ...account,
    status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING,
  };

  if (!account.externalAuthType && account.password) {
    const [hash, salt] = await generateHash(account.password, SALT_ROUNDS);

    return { ...accountData, password: hash, salt };
  }

  return accountData;
}

async function findOne(account: Partial<Account | SecuredAccount | null>): Promise<SecuredAccount | null> {
  if (!account) return null;

  return sanitize(CachedAccountRepository.findOne(account));
}

async function create(payload: Account, tx?: Transaction): Promise<SecuredAccount> {
  await validateAccount(payload);
  const accountData = await mapAccountData(payload);
  const account = await sanitize(CachedAccountRepository.create(accountData, tx));

  if (account) notify(AccountConfig.topic, AccountConfig.createdEvent, account);

  return account;
}

async function verifyAccount({ email, password }: Partial<Account>): Promise<SecuredAccount> {
  const account = await CachedAccountRepository.findOne({ email });
  if (!account) throw new UnauthorizedException();

  if (password) {
    const isValid = await compareWithHash(password, account.password);
    if (!isValid) throw new UnauthorizedException();
  }

  return sanitize(account);
}

export default { create, verifyAccount, findOne };
