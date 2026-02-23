import * as express from "express";
import pino from "pino";
import { getRecordImage } from "../backblaze/b2_client.ts";
import type { Readable } from "stream";

const router: express.Router = express.Router();
const logger: pino.Logger = pino();

router.get(
  "/:file",
  async (req: express.Request<{ file: string }>, res: express.Response): Promise<void> => {
    const file: string = req.params.file;

    logger.info(`${new Date().toISOString()} - Handling image request for file: ${file}`);

    const fileStream: Readable | undefined = await getRecordImage(file);

    if (!fileStream) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", "inline");

    fileStream.on("error", (streamErr: Error) => {
      logger.error(`${new Date().toISOString()} - ✗ Error streaming file ${file}: ${String(streamErr)}`);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        try {
          res.end();
        } catch (e) {
          logger.error(`${new Date().toISOString()} - Failed to end response after stream error: ${String(e)}`);
        }
      }
    });

    logger.info(`${new Date().toISOString()} - Piping file stream for image: ${file}`);

    fileStream.pipe(res);
  }
);

export default router;
