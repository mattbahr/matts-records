import envJSON from '../../env.json';

interface Config {
  expressHost: string;
  expressPort: number;
}

const config: Config = {
  expressHost: envJSON.EXPRESS_HOST || 'localhost',
  expressPort: Number(envJSON.EXPRESS_PORT) || 5050
}

export default config;