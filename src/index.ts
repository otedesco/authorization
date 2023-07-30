import { LoggerFactory } from "@otedesco/server-utils";

import app from "./app";

const { logger } = LoggerFactory.getInstance(__filename);

process.on("unhandledRejection", (reason) => {
  logger.error("unhandledRejection", reason);
  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Error ${error.toString()}`);
  logger.debug(error.stack);
});

app.listen();
