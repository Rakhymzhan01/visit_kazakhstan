import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: typeof mongoose | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/visit_kazakhstan_db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Prevent multiple connections in development
if (process.env.NODE_ENV === 'development' && globalThis.__mongoose) {
  mongoose.connection.close();
}

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    console.log('Attempting to connect to:', MONGODB_URI);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
      bufferCommands: false, // Disable mongoose buffering
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Store connection globally in development
    if (process.env.NODE_ENV === 'development') {
      globalThis.__mongoose = mongoose;
    }
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('Please ensure MongoDB is running on port 27017');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export { connectDB };
export default mongoose;