"use server"
import mongoose from 'mongoose';  
import './envConfig'

export default async function connectMongo(){
  try {
    const MONGODB_URI = process.env.DATABASE_URL;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }
    // Check if the connection is already established
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI);
    
    console.log('MongoDB connected successfully');
   // return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}