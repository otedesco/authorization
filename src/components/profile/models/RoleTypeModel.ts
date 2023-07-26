import { ROLE_TYPE_TABLE } from '@configs/DBConfig';
import { BaseModel, ModelObject } from '@otedesco/commons';


import { RoleType } from '../interfaces/RoleType';

export class RoleTypes extends BaseModel implements RoleType {
  id!: number;

  role: RoleType['role'];

  static get tableName() {
    return ROLE_TYPE_TABLE;
  }
}

export type RoleTypesShape = ModelObject<RoleTypes>;
