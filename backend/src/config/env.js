require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/engilearn',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Comma-separated list, e.g. "https://engilearn.app,https://engilearn-preview.vercel.app"
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),

  // Real code execution via Judge0 — all optional. Unset JUDGE0_API_URL means
  // every language stays on the mock judge. See src/services/judge0Service.js.
  judge0ApiUrl: process.env.JUDGE0_API_URL || null,
  judge0ApiKey: process.env.JUDGE0_API_KEY || null,
  judge0ApiHost: process.env.JUDGE0_API_HOST || null,
};

if (env.nodeEnv === 'production' && env.jwtSecret === 'dev-only-secret-change-me') {
  // Fail loudly rather than silently running production with a known secret.
  throw new Error('JWT_SECRET must be set to a real secret in production.');
}

module.exports = env;
