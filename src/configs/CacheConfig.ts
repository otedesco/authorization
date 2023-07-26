import { config } from 'dotenv';

import { PREFIX } from './AppConfig';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const environment = process.env;

export const CACHE_PORT = Number(environment.CACHE_PORT) || 6379;
export const CACHE_HOST = environment.CACHE_HOST || 'localhost';
export const CACHE_PREFIX = environment.CACHE_PREFIX || PREFIX;
