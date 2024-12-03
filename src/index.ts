import express from 'express';
import cors from 'cors';

import dbConnection from './models/dbConnection';
import TestModel from './models/TestModel';

const corsConfig = {
  origin: ['http://localhost:5173', 'https://customizable-forms-client.vercel.app/'],
  credentials: true,
};

const app = express();

dbConnection();

app.use(cors(corsConfig));

app.get('/', async (req, res) => {
  try {
    const test = await TestModel.create({ name: 'Test worked' });
    res.json({ message: test });
  } catch (err) {
    res.status(500).json({ message: 'Internal server err' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
