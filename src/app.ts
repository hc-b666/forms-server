import express from 'express';
import cors from 'cors';
import router from './router';
import { endpointNotFound, errorMiddleware } from './utils/errors';
import { corsConfig } from './config/cors';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors(corsConfig));
  app.use('/api/v1', router);
  app.use(endpointNotFound);
  app.use(errorMiddleware);

  return app;
};
