import { MIGRATIONS_TABLE } from './src/configs/DBConfig';
import { dbConnection } from './src/database/index';

const db = {
  ...dbConnection,
  migrations: {
    tableName: MIGRATIONS_TABLE,
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};

export default db;
