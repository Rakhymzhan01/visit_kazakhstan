const bcrypt = require('bcryptjs');

const createAdminDirectly = async () => {
  try {
    // Start backend server which will connect to MongoDB and create the admin user
    console.log('Starting backend server to create admin user...');
    console.log('Please wait for the server to start, then press Ctrl+C to stop it.');
    console.log('');
    console.log('The server will create the admin user automatically.');
  } catch (error) {
    console.error('Error:', error);
  }
};

createAdminDirectly();