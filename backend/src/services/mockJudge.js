// mockJudge.js
//
// MOCK IMPLEMENTATION. No code is ever executed here. This mirrors the
// frontend's src/services/compilerService.js on purpose: same shape of
// inputs and outputs, so swapping this file's internals for real calls to
// Judge0 (or a Docker-based sandbox) is a contained change — nothing that
// calls runCode()/gradeSubmission() needs to change.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCode({ language, code, input }) {
  await delay(300);

  if (!code || !code.trim()) {
    return { status: 'error', stdout: '', stderr: 'No code to run.', executionTimeMs: 0 };
  }

  return {
    status: 'success',
    stdout:
      `[mock output — ${language}]\n` +
      (input ? `Received input:\n${input}\n\n` : '') +
      'Real execution will run here once a sandboxed backend (e.g. Judge0) is connected.',
    stderr: '',
    executionTimeMs: Math.round(60 + Math.random() * 140),
  };
}

/**
 * Grades a submission against a problem's example test cases.
 * This is still a mock: it doesn't actually run the code against each
 * example, it just checks the code isn't empty. A real implementation
 * would send `code` + each example's `input` to the execution service and
 * diff the actual output against `example.output`.
 */
async function gradeSubmission({ problem, code }) {
  await delay(500);

  const totalTests = problem.examples?.length || 3;

  if (!code || !code.trim()) {
    return {
      verdict: 'Wrong Answer',
      testsPassed: 0,
      totalTests,
      executionTimeMs: 0,
      memoryKb: 0,
    };
  }

  return {
    verdict: 'Accepted',
    testsPassed: totalTests,
    totalTests,
    executionTimeMs: Math.round(50 + Math.random() * 120),
    memoryKb: Math.round(14000 + Math.random() * 6000),
  };
}

module.exports = { runCode, gradeSubmission };
