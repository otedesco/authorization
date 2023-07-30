import { Profile } from "@components/profile/interfaces/Profile";
import Profiles from "@components/profile/models/ProfileModel";
import { ORGANIZATION_TABLE } from "@configs/DBConfig";
import { BaseModel } from "@otedesco/commons";

import { Organization } from "../interfaces/Organization";

export class Organizations extends BaseModel implements Organization {
  id: string;

  name: string;

  collaborators?: Profile[];

  createdAt: Date;

  updatedAt: Date;

  static tableName = ORGANIZATION_TABLE;

  static get relationMappings() {
    return {
      collaborators: {
        relation: BaseModel.HasManyRelation,
        modelClass: Profiles,
        join: {
          from: `${Profiles.tableName}.id`,
          to: `${this.tableName}.collaborators`,
        },
      },
    };
  }
}
