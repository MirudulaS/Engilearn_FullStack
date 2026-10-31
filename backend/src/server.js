const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

// Connecting to the DB and starting the HTTP server are intentionally
// independent: if MongoDB isn't reachable yet, the API still comes up and
// /api/health reports db: "disconnected" instead of the whole process
// hanging or crashing. This matters most right now, before any route
// actually needs the database.
connectDB();

const server = app.listen(env.port, () => {
  console.log(`[server] EngiLearn API running in ${env.nodeEnv} mode on port ${env.port}`);
  console.log(`[server] Health check: http://localhost:${env.port}/api/health`);
});

// Surface unhandled promise rejections instead of letting them fail silently.
process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled promise rejection:', err);
  server.close(() => process.exit(1));
});

// Most hosts (Render, Railway, Docker, etc.) send SIGTERM before killing the
// process on redeploy or scale-down. Closing the HTTP server lets in-flight
// requests finish instead of being dropped mid-response.
function shutdown(signal) {
  console.log(`[server] ${signal} received, shutting down gracefully…`);
  server.close(() => {
    console.log('[server] Closed remaining connections. Exiting.');
    process.exit(0);
  });
  // Force-exit if something hangs longer than this.
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
