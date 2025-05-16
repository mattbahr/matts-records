import axios from "axios";
import fs from "fs";
import pino from "pino";
import config from "../config/config.ts";

const logger = pino();

const keyId = fs.readFileSync("/run/secrets/backblaze_key_id", "utf8").trim();
const applicationKey = fs
  .readFileSync("/run/secrets/backblaze_app_key", "utf8")
  .trim();

export const getRecordImage = async (file: string) => {
  logger.info(`${new Date().toISOString()} - Authenticating with Backblaze.`);

  const authResponse = await axios
    .get(config.b2AuthUri, {
      auth: {
        username: keyId,
        password: applicationKey,
      },
    })
    .catch(err => {
      logger.error(`${new Date().toISOString()} - Failed to authenticate with Backblaze: ${err}`);
    });

  if (
    !(
      authResponse?.data?.authorizationToken &&
      authResponse?.data?.apiInfo?.storageApi?.downloadUrl
    )
  ) {
    return;
  }

  logger.info(`${new Date().toISOString()} - Backblaze authentication successful.`);

  const {
    authorizationToken,
    apiInfo: {
      storageApi: { downloadUrl },
    },
  } = authResponse.data;
  const fullDownloadPath = `${downloadUrl}/file/${config.b2BucketName}/${file}`;

  const fileResponse = await axios
    .get(fullDownloadPath, {
      headers: { Authorization: authorizationToken },
      responseType: "stream",
    })
    .catch(err => {
      logger.error(`${new Date().toISOString()} - Failed to retrieve image from Backblaze: ${err}`);
    });

  if (!fileResponse?.data) {
    return;
  }

  return fileResponse.data;
};
