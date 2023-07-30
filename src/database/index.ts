import { LoggerFactory } from "@otedesco/server-utils";
import Knex from "knex";
import { knexSnakeCaseMappers } from "objection";

import { DEBUG, CONNECTION_POOL_SIZE, CONNECTION, CONNECTION_KEEP_ALIVE_TIMEOUT } from "../configs/DBConfig";

const { logger } = LoggerFactory.getInstance(__dirname);

const afterCreate = (conn: any, done: any) => {
  const {
    connection: { stream },
  } = conn;

  stream.setTimeout(CONNECTION_KEEP_ALIVE_TIMEOUT);
  done(null, conn);
};

export const dbConnection = {
  client: "pg",
  connection: CONNECTION,
  pool: {
    afterCreate,
    min: 3,
    max: CONNECTION_POOL_SIZE,
    createTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false,
  },
  debug: DEBUG,
  ...knexSnakeCaseMappers(),
};

const Db = Knex(dbConnection);

export const testDBConnection = async () => {
  try {
    await Db.raw("SELECT 1");
    logger.info("DB is connected successfully");
  } catch (err) {
    logger.error("DB is not connected");
    throw err;
  }
};

export default Db;
