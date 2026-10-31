const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes');
const moduleRoutes = require('./routes/module.routes');
const problemRoutes = require('./routes/problem.routes');
const compilerRoutes = require('./routes/compiler.routes');
const submissionRoutes = require('./routes/submission.routes');
const progressRoutes = require('./routes/progress.routes');
const achievementRoutes = require('./routes/achievement.routes');
const activityRoutes = require('./routes/activity.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// ---- Core middleware ----
app.use(helmet());
app.use(cors({ origin: env.clientUrls, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ---- Routes ----
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'EngiLearn API — see /api/health for status.' });
});

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
