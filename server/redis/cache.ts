import { promises as fs } from "fs";
import pino from "pino";
import { createClient } from "redis";
import config from "../config/config.ts";
import * as record from "../models/record.ts";

type RedisClientType = ReturnType<typeof createClient>;

const logger: pino.Logger<never, boolean> = pino();

const redisHost: string = config.redisHost;
const redisPort: number = config.redisPort;

const passwordSecretPath: string = "/run/secrets/redis_password";

export let redisClient: RedisClientType | null = null;

export const redisConnect = async (): Promise<void> => {
  const password: string | null = await fs.readFile(passwordSecretPath, "utf8");

  if (!password) {
    logger.error(`${new Date().toISOString()} - Failed to retrieve Redis password.`);
    return;
  }

  redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`,
    password: password.trim()
  });

  redisClient.on("error", (err: Error) => {
    logger.error(`${new Date().toISOString()} - ✗ Redis connection error: ${err}`);
  });

  await redisClient.connect();
  logger.info(`${new Date().toISOString()} - ✓ Redis connected.`);
}

export const getRandomRecord = async (): Promise<record.IRecord | null> => {
  if (!redisClient) {
    logger.error(`${new Date().toISOString()} - Redis client not initialized.`);
    return null;
  }

  const randomKey: string = String(await redisClient.randomKey());

  const record: string | null = await redisClient.get(randomKey);

  if (!record) {
    logger.error(`${new Date().toISOString()} - No record found for key: ${randomKey}`);
    return null;
  }

  return JSON.parse(record) as record.IRecord;
};

export const cacheRecords = async (records: record.IRecord[]): Promise<void> => {
  if (!redisClient) {
    logger.error(`${new Date().toISOString()} - Redis client not initialized.`);
    return;
  }

  for (let i = 0; i < records.length; i++) {
    const record: record.IRecord = records[i];
    const key: string = `record:${i}`;

    await redisClient.set(key, JSON.stringify(record));
  }
}