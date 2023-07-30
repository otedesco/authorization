import { Knex } from "knex";

import {
  ACCOUNT_TABLE,
  PROFILE_TABLE,
  PROFILE_TYPE_TABLE,
  ROLE_TYPE_TABLE,
} from "../../configs/DBConfig";
import { ProfileTypeEnum } from "../../enums/ProfileTypesEnum";
import { RoleTypeEnum } from "../../enums/RoleTypeEnum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_TABLE, (table) => {
    table
      .specificType("id", "uuid")
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique();
    table.string("name", 45).notNullable();
    table.string("last_name", 45);
    table.string("avatar_url", 255);

    table.timestamps(true, true);

    table.primary(["id"]);

    table
      .string("type")
      .notNullable()
      .defaultTo(ProfileTypeEnum.INDIVIDUAL)
      .references("type")
      .inTable(PROFILE_TYPE_TABLE);
    table
      .string("role")
      .notNullable()
      .defaultTo(RoleTypeEnum.OWNER)
      .references("role")
      .inTable(ROLE_TYPE_TABLE);

    table.uuid("account").notNullable().references("id").inTable(ACCOUNT_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(PROFILE_TABLE);
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropForeign("profile");
  });
}
