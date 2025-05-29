import express from "express";
import fs from "fs";
import pino from "pino";
import { getRecordImage } from "../backblaze/b2_client.ts";

const router = express.Router();
const logger = pino();

router.get("/:file", async (req, res) => {
  const file = req.params.file;

  logger.info(`${new Date().toISOString()} - Handling image request for file: ${file}`);

  const fileStream = await getRecordImage(file);

  if (!fileStream) {
    res.status(404).json({ message: "File not found" });
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Disposition", "inline");

  fileStream.on("error", (streamErr: Error) => {
    logger.error(`✗ Error streaming file ${file}: ${streamErr}`);
    res.status(500).json({ message: "Internal Server Error" });
  });

  logger.info(`${new Date().toISOString} - Piping file stream for image: ${file}`);

  fileStream.pipe(res);
});

export default router;
