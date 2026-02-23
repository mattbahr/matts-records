import { promises as fs } from "fs";
import mongoose from "mongoose";
import pino from "pino";
import config from "../config/config.ts";

const logger: pino.Logger = pino();

const mongoHost: string = config.mongoHost;
const mongoPort: number = config.mongoPort;

const usernameSecretPath = "/run/secrets/mongodb_basic_username";
const passwordSecretPath = "/run/secrets/mongodb_basic_password";

export const mongoConnect = async (): Promise<void> => {
  try {
    const usernameRaw: string = await fs.readFile(usernameSecretPath, "utf8");
    const passwordRaw: string = await fs.readFile(passwordSecretPath, "utf8");

    if (!usernameRaw || !passwordRaw) {
      logger.error(`${new Date().toISOString()} - Failed to retrieve MongoDB credentials.`);
      return;
    }

    const username: string = usernameRaw.trim();
    const password: string = passwordRaw.trim();

    const mongoUrl: string = `mongodb://${username}:${password}@${mongoHost}:${mongoPort}/records_db`;

    await mongoose.connect(mongoUrl);
    logger.info(`${new Date().toISOString()} - ✓ MongoDB connected.`);
  } catch (err: unknown) {
    logger.error(`${new Date().toISOString()} - ✗ MongoDB connection error: ${String(err)}`);
  }
};
