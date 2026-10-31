const mongoose = require('mongoose');
const env = require('./env');

let isConnected = false;

// Fail fast instead of queuing queries indefinitely when the DB is down —
// a controller error is much easier to debug than a request that hangs.
mongoose.set('bufferCommands', false);

async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[db] Connected to MongoDB at ${maskUri(env.mongoUri)}`);
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    console.error('[db] The API will keep running, but any route that touches the database will fail until this is fixed.');
    console.error('[db] Check MONGO_URI in your .env file and confirm MongoDB is reachable.');
  }

  return mongoose.connection;
}

function maskUri(uri) {
  // Avoid printing credentials if a connection string like
  // mongodb+srv://user:pass@host/db is used.
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[db] MongoDB disconnected.');
});

module.exports = connectDB;
