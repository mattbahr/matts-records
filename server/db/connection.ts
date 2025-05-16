import fs from "fs";
import mongoose from "mongoose";
import pino from "pino";
import config from "../config/config.ts";

const logger = pino();

const mongoHost = config.mongoHost;
const mongoPort = config.mongoPort;

const usernameSecretPath = "/run/secrets/mongodb_basic_username";
const passwordSecretPath = "/run/secrets/mongodb_basic_password";

export const mongoConnect = () => {
  fs.readFile(usernameSecretPath, "utf8", (err, username) => {
      if (err) {
        logger.error(`Failed to retrieve mongodb username: ${err}`);
        return;
      }

      fs.readFile(passwordSecretPath, "utf8", (err, password) => {
        if (err) {
          logger.error(`Failed to retrieve mongodb password: ${err}`);
          return;
        }

        const mongoUrl = `mongodb://${username.trim()}:${password.trim()}@${mongoHost}:${mongoPort}/records_db`;

        mongoose
          .connect(mongoUrl)
          .then(() => logger.info("✓ MongoDB connected."))
          .catch((err) => logger.error(`✗ MongoDB connection error: ${err}`));
      });
    });
};
