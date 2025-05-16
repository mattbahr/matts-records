import express from "express";
import pino from "pino";
import Record from "../models/record.ts";

const logger = pino();
const router = express.Router();

router.get("/", async (_, res) => {
  logger.info(`${new Date().toISOString()} - Handling record request.`);
  
  const records = await Record.find({});

  if (!(records?.length > 0)) {
    res.status(404).json({ message: "Record not found" });
    return;
  }

  const randomIdx = Math.floor(Math.random() * records.length);
  const record = records[randomIdx];

  logger.info(`${new Date().toISOString()} - Responding with random record: ${record}`);

  res.json({ record });
});

export default router;
