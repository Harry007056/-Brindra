import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Brindra backend listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend', error);
    process.exit(1);
  }
}

start();
