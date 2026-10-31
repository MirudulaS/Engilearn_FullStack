const ModuleProgress = require('../models/ModuleProgress');
const Submission = require('../models/Submission');
const Module = require('../models/Module');
const Department = require('../models/Department');
const Problem = require('../models/Problem');
const { ApiError } = require('../middleware/errorHandler');
const { checkAndAwardAchievements } = require('../services/achievementService');

// POST /api/progress/modules/:moduleId/complete  (protected)
// Toggles completion for the current user — mirrors the frontend's
// client-only "Mark as complete" button, now actually persisted.
async function toggleModuleComplete(req, res, next) {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new ApiError(404, `No module found with id "${moduleId}".`);
    }

    const existing = await ModuleProgress.findOne({ user: req.user._id, module: moduleId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, completed: false });
    }

    await ModuleProgress.create({
      user: req.user._id,
      module: moduleId,
      departmentId: module.departmentId,
    });

    checkAndAwardAchievements(req.user._id).catch((err) =>
      console.error('[achievements] module-complete check failed:', err)
    );

    res.json({ success: true, completed: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/me  (protected)
async function getMyProgress(req, res, next) {
  try {
    const userId = req.user._id;

    const [totalModules, completedModules, totalDepartments, submissions] = await Promise.all([
      Module.countDocuments(),
      ModuleProgress.find({ user: userId, completed: true }),
      Department.find(),
      Submission.find({ user: userId }),
    ]);

    const modulesCompleted = completedModules.length;
    const overallProgressPercent = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;

    // Department progress: completed modules in that department / total modules in that department.
    const moduleCountsByDept = {};
    const allModules = await Module.find().select('departmentId');
    allModules.forEach((m) => {
      moduleCountsByDept[m.departmentId] = (moduleCountsByDept[m.departmentId] || 0) + 1;
    });
    const completedByDept = {};
    completedModules.forEach((mp) => {
      completedByDept[mp.departmentId] = (completedByDept[mp.departmentId] || 0) + 1;
    });
    const departmentProgress = totalDepartments.map((d) => {
      const total = moduleCountsByDept[d._id] || 0;
      const done = completedByDept[d._id] || 0;
      return { departmentId: d._id, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    });

    // Problem stats derived from submissions, not a separate stored flag.
    const solvedProblemIds = new Set(submissions.filter((s) => s.verdict === 'Accepted').map((s) => s.problem));
    const attemptedProblemIds = new Set(submissions.map((s) => s.problem));
    const problemsSolved = solvedProblemIds.size;
    const problemsAttempted = attemptedProblemIds.size;
    const accuracyPercent = problemsAttempted > 0 ? Math.round((problemsSolved / problemsAttempted) * 100) : 0;

    res.json({
      success: true,
      overallProgressPercent,
      modulesCompleted,
      totalModules,
      problemsSolved,
      problemsAttempted,
      accuracyPercent,
      departmentProgress,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/problems  (protected)
// Returns { [problemId]: "solved" | "attempted" | "unattempted" } for every
// problem, computed from the current user's submissions. This is what
// replaces the frontend mock's hardcoded `status` field on each problem.
async function getProblemStatuses(req, res, next) {
  try {
    const [problems, submissions] = await Promise.all([
      Problem.find().select('_id'),
      Submission.find({ user: req.user._id }).select('problem verdict'),
    ]);

    const solvedProblemIds = new Set(submissions.filter((s) => s.verdict === 'Accepted').map((s) => s.problem));
    const attemptedProblemIds = new Set(submissions.map((s) => s.problem));

    const statuses = {};
    problems.forEach((p) => {
      if (solvedProblemIds.has(p._id)) statuses[p._id] = 'solved';
      else if (attemptedProblemIds.has(p._id)) statuses[p._id] = 'attempted';
      else statuses[p._id] = 'unattempted';
    });

    res.json({ success: true, statuses });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/modules  (protected)
// Returns just the completed module ids for the current user — the frontend
// uses this to show a checkmark on ModuleCard without needing the full
// aggregate stats from /progress/me.
async function getCompletedModules(req, res, next) {
  try {
    const records = await ModuleProgress.find({ user: req.user._id, completed: true }).select('module');
    res.json({ success: true, completedModuleIds: records.map((r) => r.module) });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/subjects  (protected)
// Per-subject completion, derived from Module.subject — the last piece of
// what used to be static mock data (subjectProgress / skillMatrix on the
// frontend). Level thresholds are a judgment call, documented here rather
// than hidden: <50% = Beginner, 50-89% = Intermediate, >=90% = Advanced.
// A subject with zero completed modules is omitted entirely rather than
// shown at 0%, matching how the old mock only listed subjects being
// actively worked on.
async function getSubjectProgress(req, res, next) {
  try {
    const [allModules, completedModules] = await Promise.all([
      Module.find().select('subject'),
      ModuleProgress.find({ user: req.user._id, completed: true }),
    ]);

    const totalBySubject = {};
    allModules.forEach((m) => {
      totalBySubject[m.subject] = (totalBySubject[m.subject] || 0) + 1;
    });

    const moduleSubjectById = new Map(allModules.map((m) => [m._id, m.subject]));
    const completedBySubject = {};
    completedModules.forEach((mp) => {
      const subject = moduleSubjectById.get(mp.module);
      if (!subject) return;
      completedBySubject[subject] = (completedBySubject[subject] || 0) + 1;
    });

    const subjects = Object.keys(completedBySubject).map((subject) => {
      const percent = Math.round((completedBySubject[subject] / totalBySubject[subject]) * 100);
      const level = percent >= 90 ? 'Advanced' : percent >= 50 ? 'Intermediate' : 'Beginner';
      return { subject, percent, level };
    });

    subjects.sort((a, b) => b.percent - a.percent);

    res.json({ success: true, subjects });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  toggleModuleComplete,
  getMyProgress,
  getProblemStatuses,
  getCompletedModules,
  getSubjectProgress,
};
