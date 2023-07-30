import { Profile } from "@components/profile/interfaces/Profile";
import { ACCOUNT_TABLE } from "@configs/DBConfig";
import { AccountStatusEnum } from "@enums/AccountStatusEnum";
import { ExternalAuthTypeEnum } from "@enums/ExternalAuthTypeEnum";
import { BaseModel, ModelObject } from "@otedesco/commons";

import { Account } from "../interfaces/Account";
import { AccountStatusType } from "../interfaces/AccountStatusType";
import { ExternalAuthType } from "../interfaces/ExternalAuthType";
import { Session } from "../interfaces/Session";
import { modelSchema } from "../schemas/AccountSchema";

import { AccountStatusTypes } from "./AccountStatusTypeModel";
import { ExternalAuthTypes } from "./ExternalAuthTypeModel";
import { Sessions } from "./SessionsModel";

export class Accounts extends BaseModel implements Account {
  id!: string;

  email: string;

  password: string;

  salt: string;

  externalAuthType?: ExternalAuthTypeEnum | ExternalAuthType;

  externalId?: string;

  status: AccountStatusEnum | AccountStatusType;

  sessions?: Session["id"][] | Session[];

  profiles?: Profile["id"][] | Profile[];

  createdAt: string;

  updatedAt: string;

  static tableName = ACCOUNT_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      accountStatus: {
        relation: BaseModel.HasOneRelation,
        modelClass: AccountStatusTypes,
        join: {
          from: `${AccountStatusTypes.tableName}.status`,
          to: `${this.tableName}.status`,
        },
      },
      externalAuthType: {
        relation: BaseModel.HasOneRelation,
        modelClass: ExternalAuthTypes,
        join: {
          from: `${ExternalAuthTypes.tableName}.type`,
          to: `${this.tableName}.external_auth_type`,
        },
      },
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: Sessions,
        join: {
          from: `${Sessions.tableName}.id`,
          to: `${this.tableName}.sessions`,
        },
      },
    };
  }
}

export type AccountShape = ModelObject<Accounts>;
