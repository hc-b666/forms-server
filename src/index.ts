import express from 'express';
import cors from 'cors';

import router from './routes/router';

const corsConfig = {
  origin: ['http://localhost:8080', 'https://customizable-forms-client.vercel.app'],
  credentials: true,
};

const app = express();

app.use(express.json());

app.use(cors(corsConfig));

app.use('/api/v1', router);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
