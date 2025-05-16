import pino from "pino";
import App from "./app.ts";
import config from "./config/config.ts";
import { mongoConnect } from "./db/connection.ts";

const logger = pino();

mongoConnect();

App.listen(config.port, () => {
  logger.info(`✓ Server listening on port: ${config.port}`);
});
