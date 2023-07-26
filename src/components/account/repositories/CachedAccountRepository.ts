import { SESSION_EXPIRE } from '@configs/AppConfig';
import { Cache } from '@otedesco/cache';
import { Transaction } from 'objection';


import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

import AccountRepository from './AccountRepository';

const ENABLED_CACHE = true;
const idColumns = ['email'];

async function findOne(argsObject: Partial<Account>) {
  return Cache.cacheSimpleResponse(
    idColumns,
    Accounts.tableName,
    SESSION_EXPIRE,
    ENABLED_CACHE,
    AccountRepository.findOne,
    argsObject,
  );
}

async function create(argsObject: Partial<Account>, tx?: Transaction) {
  return Cache.cacheSimpleResponse(
    idColumns,
    Accounts.tableName,
    SESSION_EXPIRE,
    false,
    args => AccountRepository.create(args, tx),
    argsObject,
  );
}

export default { findOne, create };
