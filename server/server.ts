import App from './app.ts';
import { mongoConnect } from './db/connection.ts';

const port = process.env.PORT || 5050;

mongoConnect();

App.listen(port, () => {
  console.log(`✓ Server listening on port: ${port}`)
});