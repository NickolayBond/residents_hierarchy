import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { citiesRouter } from './routes/cities.routes';
import { hierarchyRouter } from './routes/hierarchy.routes';
import { citizensRouter } from './routes/citizens.routes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/cities', citiesRouter);
  app.use('/api/citizens', citizensRouter);
  app.use('/api/hierarchy', hierarchyRouter);

  // 404
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

  // error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: err.message });
  });

  return app;
}