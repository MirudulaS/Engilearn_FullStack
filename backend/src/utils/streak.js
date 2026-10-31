function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Updates a user's streak based on when they were last active. Increments
 * on consecutive-day activity, resets to 1 if a day was missed, and does
 * nothing (no DB write) if they've already been counted today — so this is
 * cheap to call on every authenticated request.
 *
 * Mutates and saves `user`. Returns true if the streak value changed.
 */
async function updateStreak(user) {
  const today = startOfDay(new Date());
  const lastActive = user.lastActiveAt ? startOfDay(user.lastActiveAt) : null;

  if (lastActive && lastActive.getTime() === today.getTime()) {
    return false;
  }

  const dayDiff = lastActive ? Math.round((today - lastActive) / ONE_DAY_MS) : null;
  user.streakDays = dayDiff === 1 ? user.streakDays + 1 : 1;
  user.lastActiveAt = new Date();
  await user.save();
  return true;
}

module.exports = { updateStreak };
