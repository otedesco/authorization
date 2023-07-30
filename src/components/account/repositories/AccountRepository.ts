import { QueryBuilder, Transaction } from "objection";

import { Account } from "../interfaces/Account";
import { Accounts } from "../models/AccountModel";

const filterQuery = (
  query: QueryBuilder<Accounts, Accounts[]>,
  filter: Partial<Account>,
) => {
  const { id, email } = filter;

  if (email) query.where(`${Accounts.tableName}.email`, "=", email);
  if (id) query.where(`${Accounts.tableName}.id`, id);

  return query;
};

async function findOne(filter: Partial<Account>, tx?: Transaction) {
  return filterQuery(Accounts.query(tx), filter).first();
}

async function create(account: Partial<Account>, tx?: Transaction) {
  return Accounts.query(tx).insert(account);
}

export default { findOne, create };
