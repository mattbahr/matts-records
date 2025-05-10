import axios from 'axios';
import fs from 'fs';
import config from '../config/config.ts';

const keyId = fs.readFileSync('/run/secrets/backblaze_key_id', 'utf8').trim();
const applicationKey = fs.readFileSync('/run/secrets/backblaze_app_key', 'utf8').trim();

export const getRecordImage = async (file: string) => {
  const authResponse = await axios.get(config.b2AuthUri, {
    auth: {
      username: keyId,
      password: applicationKey
    }
  }).catch(err => console.error(`✗ Error authenticating with Backblaze: ${err}`));

  if (!(authResponse?.data?.authorizationToken && 
        authResponse?.data?.apiInfo?.storageApi?.downloadUrl)) {
    const dataStr = JSON.stringify(authResponse?.data);
    console.error(`✗ Invalid authentication response from Backblaze: ${dataStr}`);
    return;
  }

  console.log('✓ Backblaze authentication successful.');

  const { authorizationToken, apiInfo: { storageApi: { downloadUrl } } } = authResponse.data;
  const fullDownloadPath = `${downloadUrl}/file/${config.b2BucketName}/${file}`;
  
  const fileResponse = await axios.get(fullDownloadPath, {
    headers: { 'Authorization': authorizationToken },
    responseType: 'stream'
  }).catch(err => console.error(`✗ Error retrieving file ${file} from Backblaze: ${err}`));

  if (!fileResponse?.data) {
    const responseStr = JSON.stringify(fileResponse);
    const err = `✗ Failed to retrieve ${file} from Backblaze. Got response: ${responseStr}`;
    console.error(err);
    return;
  }

  console.log(`✓ Retrieved file ${file} from Backblaze.`);
  
  return fileResponse.data;
};