const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/visit_kazakhstan_db');
    console.log('✅ Connected to MongoDB successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();