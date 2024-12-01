import express from 'express';
import cors from 'cors';

const corsConfig = {
  origin: ['http://localhost:5173'],
  credentials: true,
};

const app = express();

app.use(cors(corsConfig));

app.get('/', (req, res) => {
  res.json({ message: 'We got your request!' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
