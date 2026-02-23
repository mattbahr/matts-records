import pino from "pino";
import App from "./app.ts";
import config from "./config/config.ts";
import { mongoConnect } from "./db/connection.ts";
import { redisConnect } from "./redis/cache.ts";
import type { Application } from "express";
import type { Server } from "http";

const logger: pino.Logger = pino();

const expressApp: Application = App as unknown as Application;

mongoConnect();

redisConnect().catch((err: unknown) => {
  logger.error(`${new Date().toISOString()} - Failed to connect to Redis: ${String(err)}`);
});

const server: Server = expressApp.listen(config.port, () => {
  logger.info(`${new Date().toISOString()} - ✓ Server listening on port: ${config.port}`);
});

export default server;
