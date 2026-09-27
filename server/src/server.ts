import { createApp } from './app';
import { config } from './config';
import { pool } from './db/pool';

async function bootstrap() {
  await pool.query('SELECT 1');

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Server ready at http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
}); 