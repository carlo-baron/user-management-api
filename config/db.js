import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connection Successful');
    return conn;
  } catch (error) {
    console.error('DB Connection Unsuccessful:', error.message);
    process.exit(1);
  }
}

