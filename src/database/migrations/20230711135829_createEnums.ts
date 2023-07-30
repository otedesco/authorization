import { Knex } from "knex";

import {
  EXTERNAL_AUTH_TYPE_TABLE,
  ACCOUNT_STATUS_TYPE_TABLE,
  PROFILE_TYPE_TABLE,
  ROLE_TYPE_TABLE,
} from "../../configs/DBConfig";
import { AccountStatusEnum } from "../../enums/AccountStatusEnum";
import { ExternalAuthTypeEnum } from "../../enums/ExternalAuthTypeEnum";
import { ProfileTypeEnum } from "../../enums/ProfileTypesEnum";
import { RoleTypeEnum } from "../../enums/RoleTypeEnum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(EXTERNAL_AUTH_TYPE_TABLE, (table) => {
    table.specificType("id", "serial").notNullable();
    table.string("type", 15).notNullable();
    table.primary(["type"]);

    table.timestamps(true, true);
  });
  await knex(EXTERNAL_AUTH_TYPE_TABLE).insert([
    { type: ExternalAuthTypeEnum.GOOGLE },
    { type: ExternalAuthTypeEnum.FACEBOOK },
  ]);

  await knex.schema.createTable(ACCOUNT_STATUS_TYPE_TABLE, (table) => {
    table.specificType("id", "serial").notNullable();
    table.string("status", 30).notNullable();
    table.primary(["status"]);

    table.timestamps(true, true);
  });
  await knex(ACCOUNT_STATUS_TYPE_TABLE).insert([
    { status: AccountStatusEnum.VERIFIED },
    { status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING },
  ]);

  await knex.schema.createTable(PROFILE_TYPE_TABLE, (table) => {
    table.specificType("id", "serial").notNullable();
    table.string("type", 15).notNullable();
    table.primary(["type"]);

    table.timestamps(true, true);
  });
  await knex(PROFILE_TYPE_TABLE).insert([
    { type: ProfileTypeEnum.INDIVIDUAL },
    { type: ProfileTypeEnum.COLLABORATOR },
  ]);

  await knex.schema.createTable(ROLE_TYPE_TABLE, (table) => {
    table.specificType("id", "serial").notNullable();
    table.string("role", 15).notNullable();
    table.primary(["role"]);

    table.timestamps(true, true);
  });
  await knex(ROLE_TYPE_TABLE).insert([
    { role: RoleTypeEnum.OWNER },
    { role: RoleTypeEnum.ADMIN },
    { role: RoleTypeEnum.READ_ONLY },
    { role: RoleTypeEnum.WRITE },
  ]);
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(EXTERNAL_AUTH_TYPE_TABLE);
  await knex.schema.dropTable(ACCOUNT_STATUS_TYPE_TABLE);
  await knex.schema.dropTable(PROFILE_TYPE_TABLE);
  await knex.schema.dropTable(ROLE_TYPE_TABLE);
}
