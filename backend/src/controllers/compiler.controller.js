const { ApiError } = require('../middleware/errorHandler');
const codeExecution = require('../services/codeExecutionService');

// POST /api/compiler/run  (protected)
// body: { language, code, input }
async function run(req, res, next) {
  try {
    const { language, code, input } = req.body;
    if (!language) {
      throw new ApiError(400, 'language is required.');
    }
    const result = await codeExecution.runCode({ language, code, input });
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

module.exports = { run };
