const Problem = require('../models/Problem');
const { ApiError } = require('../middleware/errorHandler');

// GET /api/problems
// Query params: department, category, module, difficulty, q (search title/topic)
// Note: there is no "status" filter here — solved/attempted/unattempted is
// per-user data that doesn't exist until the Submissions/Progress step. The
// frontend's current status filter will move to a joined query then.
async function listProblems(req, res, next) {
  try {
    const { department, category, module, difficulty, q } = req.query;
    const filter = {};

    if (department) filter.departmentId = department;
    if (category) filter.categoryId = category;
    if (module) filter.moduleId = module;
    if (difficulty) filter.difficulty = difficulty;
    if (q) filter.$text = { $search: q };

    const problems = await Problem.find(filter).sort({ title: 1 });
    res.json({ success: true, count: problems.length, problems });
  } catch (err) {
    next(err);
  }
}

// GET /api/problems/:id
async function getProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      throw new ApiError(404, `No problem found with id "${req.params.id}".`);
    }
    res.json({ success: true, problem });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProblems, getProblem };
