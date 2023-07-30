import { Knex } from "knex";

import { ORGANIZATION_TABLE, PROFILE_TABLE } from "../../configs/DBConfig";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ORGANIZATION_TABLE, (table) => {
    table
      .specificType("id", "uuid")
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique();
    table.string("name", 45).notNullable();

    table.timestamps(true, true);

    table.primary(["id"]);
  });

  await knex.schema.alterTable(PROFILE_TABLE, (table) => {
    table
      .uuid("organization")
      .references("id")
      .inTable(ORGANIZATION_TABLE)
      .defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ORGANIZATION_TABLE);
  await knex.schema.alterTable(PROFILE_TABLE, (table) => {
    table.dropForeign("organization");
  });
}
