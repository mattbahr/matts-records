import axios, { type AxiosResponse } from "axios";
import http from "http";
import https from "https";
import fs from "fs";
import pino from "pino";
import config from "../config/config.ts";
import type { Readable } from "stream";

const logger: pino.Logger = pino();

const keyId: string = fs.readFileSync("/run/secrets/backblaze_key_id", "utf8").trim();
const applicationKey: string = fs
  .readFileSync("/run/secrets/backblaze_app_key", "utf8")
  .trim();

interface B2AuthData {
  authorizationToken?: string;
  apiInfo?: {
    storageApi?: {
      downloadUrl?: string;
    };
  };
}

export const getRecordImage = async (
  file: string
): Promise<Readable | undefined> => {
  logger.info(`${new Date().toISOString()} - Authenticating with Backblaze.`);

  let authResponse: AxiosResponse<B2AuthData> | undefined;

  try {
    authResponse = await axios.get<B2AuthData>(config.b2AuthUri, {
      auth: {
        username: keyId,
        password: applicationKey,
      },
      // ask the remote server to close the connection and don't reuse sockets
      headers: { Connection: "close" },
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    });
  } catch (err: unknown) {
    logger.error(`${new Date().toISOString()} - Failed to authenticate with Backblaze: ${String(err)}`);
    authResponse = undefined;
  }

  const authorizationToken = authResponse?.data?.authorizationToken;
  const downloadUrl = authResponse?.data?.apiInfo?.storageApi?.downloadUrl;

  if (!authorizationToken || !downloadUrl) {
    return;
  }

  logger.info(`${new Date().toISOString()} - Backblaze authentication successful.`);

  const fullDownloadPath = `${downloadUrl}/file/${config.b2BucketName}/${file}`;

  let fileResponse: AxiosResponse<Readable> | undefined;
  try {
    fileResponse = await axios.get<Readable>(fullDownloadPath, {
      responseType: "stream",
      headers: { Authorization: authorizationToken, Connection: "close" },
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    });
  } catch (err: unknown) {
    logger.error(`${new Date().toISOString()} - Failed to retrieve image from Backblaze: ${String(err)}`);
    fileResponse = undefined;
  }

  if (!fileResponse?.data) {
    return;
  }

  return fileResponse.data as Readable;
};
