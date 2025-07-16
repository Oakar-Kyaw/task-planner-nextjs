"use server"
import mongoose from 'mongoose';  
import './envConfig'

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

export default async function connectMongo(){
  try {
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
  // if (cached.conn) {
  //   return cached.conn;
  // }

  // if (!cached.promise) {
  //   const opts = {
  //     bufferCommands: false,
  //   };

  //   cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
  //     return mongoose;
  //   });
  // }
  // cached.conn = await cached.promise;
  // return cached.conn;
}
// async function connectMongo() {  
//     if (!MONGO_URI) {  
//         throw new Error('Please define the MONGO_URI environment variable inside .env.local');  
//     }  
//     if (cached.connection) {  
//         return cached.connection;  
//     }  
//     if (!cached.promise) {  
//         const opts = {  
//             bufferCommands: false,  
//         };  
//         cached.promise = mongoose.connect(MONGO_URI, opts);  
//     }  
//     try {  
//         cached.connection = await cached.promise;  
//     } catch (e) {  
//         cached.promise = undefined;  
//         throw e;  
//     }  
//     return cached.connection;  
// }  
// export default connectMongo