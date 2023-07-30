import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const environment = process.env;

// DB CONFIG
export const CONNECTION =
  environment.PG_CONNECTION || "postgres://apart:secret@127.0.0.1:5432/auth";
export const TIMEOUT = Number(environment.DB_TIMEOUT) || 200;
export const CONNECTION_KEEP_ALIVE_TIMEOUT =
  Number(environment.CONNECTION_KEEP_ALIVE_TIMEOUT) || 60000;
export const CONNECTION_POOL_SIZE =
  Number(environment.DB_CONNECTION_POOL_SIZE) || 20;
export const DEBUG = environment.DB_DEBUG === "true" || false;

// TABLE NAMES
export const MIGRATIONS_TABLE = "knex_migrations";
export const ACCOUNT_TABLE = "accounts";
export const PROFILE_TABLE = "profiles";
export const ORGANIZATION_TABLE = "organizations";
export const SESSION_TABLE = "sessions";
export const EXTERNAL_AUTH_TYPE_TABLE = "external_auth_types";
export const ACCOUNT_STATUS_TYPE_TABLE = "account_status_types";
export const PROFILE_TYPE_TABLE = "profile_types";
export const ROLE_TYPE_TABLE = "role_types";

// DB UTILITIES CONFIGS
export const CURSOR_BATCH_SIZE = 500;
