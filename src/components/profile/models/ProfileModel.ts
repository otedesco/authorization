
import { Account } from '@components/account/interfaces/Account';
import { Accounts } from '@components/account/models/AccountModel';
import { Organization } from '@components/organization/interfaces/Organization';
import { Organizations } from '@components/organization/models/OrganizationModel';
import { PROFILE_TABLE } from '@configs/DBConfig';
import { BaseModel, ModelObject } from '@otedesco/commons';

import { Profile } from '../interfaces/Profile';
import { ProfileType } from '../interfaces/ProfileType';
import { RoleType } from '../interfaces/RoleType';

import { ProfileTypes } from './ProfileTypeModel';
import { RoleTypes } from './RoleTypeModel';

export default class Profiles extends BaseModel implements Profile {
  id!: string;

  name: string;

  lastName: string;

  avatarUrl?: string;

  role: RoleType['role'] | RoleType;

  type: ProfileType['type'] | ProfileType;

  organization?: Organization['id'] | Organization;

  account: Account['id'] | Account;

  createdAt: Date;

  updatedAt: Date;

  static tableName: string = PROFILE_TABLE;

  static get relationMappings() {
    return {
      profileRoles: {
        relation: BaseModel.HasOneRelation,
        modelClass: RoleTypes,
        join: {
          from: `${RoleTypes.tableName}.role`,
          to: `${this.tableName}.role`,
        },
      },
      profileTypes: {
        relation: BaseModel.HasOneRelation,
        modelClass: ProfileTypes,
        join: {
          from: `${ProfileTypes.tableName}.type`,
          to: `${this.tableName}.type`,
        },
      },
      profileAccounts: {
        relation: BaseModel.HasOneRelation,
        modelClass: Accounts,
        join: {
          from: `${Accounts.tableName}.id`,
          to: `${this.tableName}.account`,
        },
      },
      profileOrganizations: {
        relation: BaseModel.HasOneRelation,
        modelClass: Organizations,
        join: {
          from: `${Organizations.tableName}.id`,
          to: `${this.tableName}.organization`,
        },
      },
    };
  }
}

export type ProfilesShape = ModelObject<Profiles>;
