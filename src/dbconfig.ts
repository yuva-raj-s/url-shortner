import mongoose from "mongoose";
const dotenv = require('dotenv');
const path = require('path');

// Get the absolute path to scripts.env
const envPath = path.resolve(__dirname, '../scripts.env');
console.log('Loading env from:', envPath);

dotenv.config({ path: envPath });

// Debug: Log the MONGO_URI
console.log('MONGO_URI:', process.env.MONGO_URI);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;