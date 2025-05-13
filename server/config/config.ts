import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoHost: string;
  mongoPort: number;
  b2AuthUri: string;
  b2BucketName: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5050,
  mongoHost: process.env.MONGO_HOST || 'mongo',
  mongoPort: Number(process.env.MONGO_PORT) || 27017,
  b2AuthUri: process.env.B2_AUTH_URI || '',
  b2BucketName: process.env.B2_BUCKET_NAME || 'my-album-covers'
}

export default config;