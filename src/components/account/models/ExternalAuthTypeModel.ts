import { EXTERNAL_AUTH_TYPE_TABLE } from "@configs/DBConfig";
import { ExternalAuthTypeEnum } from "@enums/ExternalAuthTypeEnum";
import { BaseModel, ModelObject } from "@otedesco/commons";

import { ExternalAuthType } from "../interfaces/ExternalAuthType";
import { modelSchema } from "../schemas/ExternalAuthType";

export class ExternalAuthTypes extends BaseModel implements ExternalAuthType {
  id!: number;

  type: ExternalAuthTypeEnum;

  static get tableName() {
    return EXTERNAL_AUTH_TYPE_TABLE;
  }

  static get jsonSchema() {
    return modelSchema;
  }
}

export type ExternalAuthTypesShape = ModelObject<ExternalAuthTypes>;
