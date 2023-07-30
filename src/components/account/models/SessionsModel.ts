import { ACCOUNT_TABLE } from "@configs/DBConfig";
import { BaseModel, ModelObject } from "@otedesco/commons";

import { Account } from "../interfaces/Account";
import { Session } from "../interfaces/Session";

import { Accounts } from "./AccountModel";

export class Sessions extends BaseModel implements Session {
  id!: string;

  account?: Account["id"] | Account;

  createdAt: Date;

  updatedAt: Date;

  static tableName = ACCOUNT_TABLE;

  static get relationMappings() {
    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Accounts,
        join: {
          from: `${Accounts.tableName}.id`,
          to: `${this.tableName}.account`,
        },
      },
    };
  }
}

export type SessionsShape = ModelObject<Sessions>;
