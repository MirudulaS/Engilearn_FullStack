const { achievementDefinitions } = require('../services/achievementService');
const UserAchievement = require('../models/UserAchievement');

// GET /api/achievements/me  (protected)
async function listMyAchievements(req, res, next) {
  try {
    const earned = await UserAchievement.find({ user: req.user._id });
    const earnedMap = new Map(earned.map((e) => [e.achievementId, e.earnedAt]));

    const achievements = achievementDefinitions.map((def) => ({
      id: def.id,
      title: def.title,
      description: def.description,
      earned: earnedMap.has(def.id),
      earnedAt: earnedMap.get(def.id) ?? null,
    }));

    res.json({ success: true, achievements });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMyAchievements };
