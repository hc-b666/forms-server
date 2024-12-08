import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
  try {
    const mongodb_url = process.env.MONGODB_URL;
    if (!mongodb_url) {
      throw new Error('MONGODB_URL is not defined in .env file');
    }

    await mongoose.connect(mongodb_url, {}).then(() => console.log('Connected to database'));
  } catch (err) {
    console.log(err);
  }
};

export default dbConnection;
