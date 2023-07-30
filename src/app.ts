import { AuthenticationRoute, PrivateAuthenticationRoute } from "@components/authentication/routes";
import { CACHE_HOST, CACHE_PORT } from "@configs/CacheConfig";
import knex, { testDBConnection } from "@database/index";
import { handleError, logError } from "@middlewares/index";
import { Cache } from "@otedesco/cache";
import { AppFactory, ConfigOptions, LoggerFactory } from "@otedesco/server-utils";
import validateEnv from "@utils/validateEnv";
import { Model } from "objection";

const { logger } = LoggerFactory.getInstance(__filename);

const V1Routes = [new AuthenticationRoute(), new PrivateAuthenticationRoute()];

const serverConfig: ConfigOptions = {
  routes: [{ version: "/v1", routes: V1Routes }],
  logger,
};

class AuthServer extends AppFactory {
  async initializeConnections() {
    logger.info("Initializing postgres DB connection");
    Model.knex(knex);
    await testDBConnection().catch(logger.error);
    logger.info("Initializing cache connection");
    await Cache.init({ socket: { host: CACHE_HOST, port: CACHE_PORT }, logger }).catch(logger.error);
  }

  initializeErrorHandling(): void {
    logger.info("Initializing error handlers middlewares");
    this.app.use(logError);
    this.app.use(handleError);
    logger.info("Error handlers middlewares initialized");
  }
}

validateEnv();
export default new AuthServer(serverConfig);
