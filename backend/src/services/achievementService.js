const achievementDefinitions = require('../data/achievementDefinitions');
const UserAchievement = require('../models/UserAchievement');
const Submission = require('../models/Submission');
const ModuleProgress = require('../models/ModuleProgress');
const Module = require('../models/Module');
const Department = require('../models/Department');

/**
 * Re-evaluates every achievement definition for a user and inserts any
 * newly-earned ones. Safe to call after any action that could unlock one
 * (a submission, a module completion) — already-earned ones are skipped via
 * the unique index, so calling this often is cheap and idempotent.
 *
 * Returns the achievement ids newly earned by this call (empty if none).
 */
async function checkAndAwardAchievements(userId) {
  const [alreadyEarned, submissions, completedModules, allModules] = await Promise.all([
    UserAchievement.find({ user: userId }),
    Submission.find({ user: userId }),
    ModuleProgress.find({ user: userId, completed: true }),
    Module.find(),
  ]);

  const earnedIds = new Set(alreadyEarned.map((a) => a.achievementId));
  const solvedProblemIds = new Set(submissions.filter((s) => s.verdict === 'Accepted').map((s) => s.problem));
  const problemsSolved = solvedProblemIds.size;

  const completedModuleIds = new Set(completedModules.map((m) => m.module));
  const moduleById = new Map(allModules.map((m) => [m._id, m]));

  const newlyEarned = [];

  for (const def of achievementDefinitions) {
    if (earnedIds.has(def.id)) continue;

    let met = false;

    if (def.type === 'problems-solved') {
      met = problemsSolved >= def.threshold;
    } else if (def.type === 'subject-started') {
      met = allModules.some((m) => m.subject === def.subject && completedModuleIds.has(m._id));
    } else if (def.type === 'subject-mastery') {
      const subjectModules = allModules.filter((m) => m.subject === def.subject);
      met = subjectModules.length > 0 && subjectModules.every((m) => completedModuleIds.has(m._id));
    } else if (def.type === 'category-completion') {
      // Group this user's completed modules by category and compare against
      // each category's total module count from the Department document.
      const completedByCategory = {};
      completedModules.forEach((mp) => {
        const mod = moduleById.get(mp.module);
        if (!mod) return;
        const key = `${mod.departmentId}::${mod.categoryId}`;
        completedByCategory[key] = (completedByCategory[key] || 0) + 1;
      });
      if (Object.keys(completedByCategory).length > 0) {
        const departments = await Department.find();
        met = departments.some((dept) =>
          dept.categories.some((cat) => {
            const key = `${dept._id}::${cat.id}`;
            return cat.moduleCount > 0 && completedByCategory[key] >= cat.moduleCount;
          })
        );
      }
    }
    // 'streak' achievements are awarded from the streak-tracking logic in
    // the auth middleware, not here — they depend on User.streakDays.

    if (met) {
      newlyEarned.push(def.id);
    }
  }

  if (newlyEarned.length > 0) {
    // Insert one at a time so a duplicate-key race (two requests finishing
    // at once) on one achievement doesn't stop the others from saving.
    await Promise.all(
      newlyEarned.map((id) =>
        UserAchievement.create({ user: userId, achievementId: id }).catch(() => null)
      )
    );
  }

  return newlyEarned;
}

/**
 * Called from the streak-tracking logic once User.streakDays changes, since
 * streak achievements depend on a value this service doesn't otherwise see.
 */
async function checkStreakAchievements(userId, streakDays) {
  const streakDefs = achievementDefinitions.filter((d) => d.type === 'streak' && streakDays >= d.threshold);
  if (streakDefs.length === 0) return [];

  const alreadyEarned = await UserAchievement.find({ user: userId });
  const earnedIds = new Set(alreadyEarned.map((a) => a.achievementId));
  const newlyEarned = streakDefs.filter((d) => !earnedIds.has(d.id)).map((d) => d.id);

  if (newlyEarned.length > 0) {
    await Promise.all(
      newlyEarned.map((id) =>
        UserAchievement.create({ user: userId, achievementId: id }).catch(() => null)
      )
    );
  }
  return newlyEarned;
}

module.exports = { checkAndAwardAchievements, checkStreakAchievements, achievementDefinitions };
