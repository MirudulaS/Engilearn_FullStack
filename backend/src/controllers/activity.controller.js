const Submission = require('../models/Submission');
const ModuleProgress = require('../models/ModuleProgress');
const UserAchievement = require('../models/UserAchievement');
const Problem = require('../models/Problem');
const Module = require('../models/Module');
const achievementDefinitions = require('../data/achievementDefinitions');

// GET /api/activity/me  (protected)
// Nothing is stored as "activity" directly — this merges three collections
// that already have their own timestamps (Submission.createdAt,
// ModuleProgress.completedAt, UserAchievement.earnedAt) rather than writing
// a duplicate log entry every time one of those things happens.
async function getMyActivity(req, res, next) {
  try {
    const userId = req.user._id;

    const [submissions, moduleCompletions, achievementsEarned] = await Promise.all([
      Submission.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
      ModuleProgress.find({ user: userId, completed: true }).sort({ completedAt: -1 }).limit(10),
      UserAchievement.find({ user: userId }).sort({ earnedAt: -1 }).limit(10),
    ]);

    const problemIds = [...new Set(submissions.map((s) => s.problem))];
    const moduleIds = [...new Set(moduleCompletions.map((m) => m.module))];

    const [problems, modules] = await Promise.all([
      Problem.find({ _id: { $in: problemIds } }).select('title subject'),
      Module.find({ _id: { $in: moduleIds } }).select('title subject'),
    ]);
    const problemMap = new Map(problems.map((p) => [p._id, p]));
    const moduleMap = new Map(modules.map((m) => [m._id, m]));
    const achievementDefMap = new Map(achievementDefinitions.map((a) => [a.id, a]));

    const items = [];

    submissions.forEach((s) => {
      const problem = problemMap.get(s.problem);
      items.push({
        id: `submission-${s._id}`,
        type: 'submission',
        label: `${s.verdict === 'Accepted' ? 'Solved' : 'Attempted'} "${problem?.title ?? s.problem}"`,
        meta: problem ? `${problem.subject} · ${s.verdict}` : s.verdict,
        timestamp: s.createdAt,
      });
    });

    moduleCompletions.forEach((mp) => {
      const mod = moduleMap.get(mp.module);
      items.push({
        id: `module-${mp._id}`,
        type: 'module',
        label: `Completed "${mod?.title ?? mp.module}"`,
        meta: mod?.subject ?? '',
        timestamp: mp.completedAt,
      });
    });

    achievementsEarned.forEach((a) => {
      const def = achievementDefMap.get(a.achievementId);
      items.push({
        id: `achievement-${a._id}`,
        type: 'achievement',
        label: `Earned "${def?.title ?? a.achievementId}"`,
        meta: 'Achievement',
        timestamp: a.earnedAt,
      });
    });

    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, activity: items.slice(0, 10) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyActivity };
