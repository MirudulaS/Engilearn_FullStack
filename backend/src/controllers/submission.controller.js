const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { ApiError } = require('../middleware/errorHandler');
const codeExecution = require('../services/codeExecutionService');
const { checkAndAwardAchievements } = require('../services/achievementService');

// POST /api/submissions  (protected)
// body: { problemId, language, code }
async function createSubmission(req, res, next) {
  try {
    const { problemId, language, code } = req.body;
    if (!problemId || !language || code === undefined) {
      throw new ApiError(400, 'problemId, language, and code are all required.');
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      throw new ApiError(404, `No problem found with id "${problemId}".`);
    }

    const grade = await codeExecution.gradeSubmission({ problem, code, language });

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      language,
      code,
      ...grade,
    });

    if (grade.verdict === 'Accepted') {
      checkAndAwardAchievements(req.user._id).catch((err) =>
        console.error('[achievements] submission check failed:', err)
      );
    }

    res.status(201).json({ success: true, submission });
  } catch (err) {
    next(err);
  }
}

// GET /api/submissions/me?problemId=...  (protected)
async function listMySubmissions(req, res, next) {
  try {
    const filter = { user: req.user._id };
    if (req.query.problemId) filter.problem = req.query.problemId;

    const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, submissions });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSubmission, listMySubmissions };
