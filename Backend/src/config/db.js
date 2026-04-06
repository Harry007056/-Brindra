const mongoose = require('mongoose');

let connectionPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brindra';
    connectionPromise = mongoose.connect(uri).then((instance) => {
      console.log('MongoDB connected');
      return instance.connection;
    });
  }

  return connectionPromise;
}

module.exports = connectToDatabase;
