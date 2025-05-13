import App from './app.ts';
import config from './config/config.ts';
import { mongoConnect } from './db/connection.ts';

mongoConnect();

App.listen(config.port, () => {
  console.log(`✓ Server listening on port: ${config.port}`)
});