import envJSON from "../../env.json";

interface Config {
  expressUri: string;
}

const config: Config = {
  expressUri: envJSON.EXPRESS_URI || "localhost",
};

export default config;
