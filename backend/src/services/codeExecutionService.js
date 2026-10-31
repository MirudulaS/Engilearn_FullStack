// codeExecutionService.js
//
// The single entry point compiler/submission controllers should import.
// Per language, picks real Judge0 execution when it's configured AND that
// language is one Judge0 can meaningfully run (see judge0Service's
// LANGUAGE_IDS) — otherwise falls back to the mock judge. This means
// enabling Judge0 doesn't require touching any controller: the same
// runCode()/gradeSubmission() calls just start returning real results for
// the languages Judge0 supports, and stay mocked for the ones it can't
// (HTML, CSS, SQL, Verilog).

const mockJudge = require('./mockJudge');
const judge0 = require('./judge0Service');

async function runCode({ language, code, input }) {
  if (judge0.isSupportedByJudge0(language)) {
    try {
      return await judge0.runCode({ language, code, input });
    } catch (err) {
      console.error('[codeExecution] Judge0 run failed, falling back to mock:', err.message);
      return mockJudge.runCode({ language, code, input });
    }
  }
  return mockJudge.runCode({ language, code, input });
}

async function gradeSubmission({ problem, code, language }) {
  if (judge0.isSupportedByJudge0(language)) {
    try {
      return await judge0.gradeSubmission({ problem, code, language });
    } catch (err) {
      console.error('[codeExecution] Judge0 grading failed, falling back to mock:', err.message);
      return mockJudge.gradeSubmission({ problem, code });
    }
  }
  return mockJudge.gradeSubmission({ problem, code });
}

module.exports = { runCode, gradeSubmission };
