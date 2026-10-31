const { verifyToken } = require('../utils/token');
const { ApiError } = require('./errorHandler');
const User = require('../models/User');
const { updateStreak } = require('../utils/streak');
const { checkStreakAchievements } = require('../services/achievementService');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized — no token provided.');
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized — user no longer exists.');
    }

    const streakChanged = await updateStreak(user);
    if (streakChanged) {
      // Fire-and-forget: an achievement unlocking a moment late is fine,
      // but we shouldn't hold up the actual request for it.
      checkStreakAchievements(user._id, user.streakDays).catch((err) =>
        console.error('[achievements] streak check failed:', err)
      );
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Not authorized — invalid or expired token.'));
    }
    next(err);
  }
}

module.exports = { protect };
