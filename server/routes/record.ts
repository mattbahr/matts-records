import * as express from "express";
import pino from "pino";
import mongoose, { Document } from "mongoose";
import Record, * as record from "../models/record.ts";
import { getRandomRecord, cacheRecords } from "../redis/cache.ts";

const logger: pino.Logger = pino();
const router: express.Router = express.Router();

router.get("/", async (_req: express.Request, res: express.Response): Promise<void> => {
  logger.info(`${new Date().toISOString()} - Handling record request.`);

  const cachedRecord: record.IRecord | null = await getRandomRecord();

  if (cachedRecord) {
    logger.info(`${new Date().toISOString()} - Responding with cached record: ${JSON.stringify(cachedRecord)}`);
    res.json({ record: cachedRecord });
    return;
  }

  const records = (await Record.find({})) as Array<Document & record.IRecord>;

  if (!(records?.length > 0)) {
    res.status(404).json({ message: "Record not found" });
    return;
  }

  const randomIdx: number = Math.floor(Math.random() * records.length);
  const rec: record.IRecord = records[randomIdx];

  logger.info(`${new Date().toISOString()} - Responding with random record: ${JSON.stringify(rec)}`);

  res.json({ record: rec });

  await cacheRecords(records);
});

export default router;
