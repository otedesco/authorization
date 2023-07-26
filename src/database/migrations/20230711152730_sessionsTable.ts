import { Knex } from 'knex';

import { ACCOUNT_TABLE, SESSION_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(SESSION_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();

    table.timestamps(true, true);

    table.primary(['id']);

    table.uuid('account').notNullable().references('id').inTable(ACCOUNT_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(SESSION_TABLE);
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropColumn('sessions');
  });
}
