// judge0Service.js
//
// Real code execution via Judge0 (https://judge0.com/) — either the
// RapidAPI-hosted instance (judge0-ce.p.rapidapi.com) or a self-hosted one.
//
// IMPORTANT — HONEST STATUS: this was written against Judge0's documented
// CE API contract, but has NOT been exercised against a live Judge0
// instance (no network path to one from where this was built, and no API
// key). Treat it as a well-structured starting point, not a verified
// integration — run the "Run" and "Submit" flows yourself against a real
// JUDGE0_API_URL before relying on this in front of real users.
//
// Configuration (all optional — everything falls back to the mock judge
// if unset):
//   JUDGE0_API_URL     e.g. https://judge0-ce.p.rapidapi.com  (or your self-hosted URL)
//   JUDGE0_API_KEY     required only for the RapidAPI-hosted option
//   JUDGE0_API_HOST    required only for the RapidAPI-hosted option, e.g. judge0-ce.p.rapidapi.com

const env = require('../config/env');

// Judge0 CE language ids for the subset of EngiLearn's languages that are
// general-purpose enough to meaningfully "run" with stdin/stdout. HTML, CSS,
// SQL, and Verilog are intentionally left out — Judge0 has no notion of a
// browser DOM, a database engine, or an HDL simulator, so those stay on the
// mock judge even when Judge0 is configured (see isSupportedByJudge0 below).
const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  c: 50, // C (GCC)
  cpp: 54, // C++ (GCC, C++17)
  java: 62, // Java (OpenJDK)
};

function isConfigured() {
  return Boolean(env.judge0ApiUrl);
}

function isSupportedByJudge0(language) {
  return isConfigured() && Object.prototype.hasOwnProperty.call(LANGUAGE_IDS, language);
}

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (env.judge0ApiKey) headers['X-RapidAPI-Key'] = env.judge0ApiKey;
  if (env.judge0ApiHost) headers['X-RapidAPI-Host'] = env.judge0ApiHost;
  return headers;
}

/**
 * Submits source + stdin to Judge0 and waits for the result (using Judge0's
 * `wait=true` synchronous mode — fine for short student-exercise runs;
 * would need to move to polling by token for longer-running submissions).
 */
async function submitToJudge0({ language, code, stdin }) {
  const url = `${env.judge0ApiUrl.replace(/\/$/, '')}/submissions?base64_encoded=false&wait=true`;

  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      language_id: LANGUAGE_IDS[language],
      source_code: code,
      stdin: stdin || '',
    }),
  });

  if (!res.ok) {
    throw new Error(`Judge0 request failed with status ${res.status}`);
  }

  return res.json();
  // Judge0's response includes: stdout, stderr, compile_output, status: { id, description }, time, memory
}

async function runCode({ language, code, input }) {
  if (!code || !code.trim()) {
    return { status: 'error', stdout: '', stderr: 'No code to run.', executionTimeMs: 0 };
  }

  const result = await submitToJudge0({ language, code, stdin: input });

  const succeeded = result.status?.id === 3; // Judge0 status id 3 = "Accepted" (ran without error)
  return {
    status: succeeded ? 'success' : 'error',
    stdout: result.stdout || '',
    stderr: result.stderr || result.compile_output || result.status?.description || '',
    executionTimeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : 0,
  };
}

async function gradeSubmission({ problem, code, language }) {
  const examples = problem.examples || [];
  const totalTests = examples.length || 3;

  if (!code || !code.trim()) {
    return { verdict: 'Wrong Answer', testsPassed: 0, totalTests, executionTimeMs: 0, memoryKb: 0 };
  }

  if (examples.length === 0) {
    // No example test cases to grade against — fall back to "did it run at all".
    const result = await submitToJudge0({ language, code, stdin: '' });
    const ran = result.status?.id === 3;
    return {
      verdict: ran ? 'Accepted' : 'Runtime Error',
      testsPassed: ran ? totalTests : 0,
      totalTests,
      executionTimeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : 0,
      memoryKb: result.memory || 0,
    };
  }

  let passed = 0;
  let lastResult = null;
  let totalTimeMs = 0;
  let maxMemoryKb = 0;

  for (const example of examples) {
    // eslint-disable-next-line no-await-in-loop
    const result = await submitToJudge0({ language, code, stdin: example.input });
    lastResult = result;
    totalTimeMs += result.time ? parseFloat(result.time) * 1000 : 0;
    maxMemoryKb = Math.max(maxMemoryKb, result.memory || 0);

    const actualOutput = (result.stdout || '').trim();
    const expectedOutput = String(example.output || '').trim();
    if (result.status?.id === 3 && actualOutput === expectedOutput) {
      passed += 1;
    }
  }

  let verdict = 'Accepted';
  if (passed < totalTests) {
    if (lastResult?.status?.id === 6) verdict = 'Compilation Error';
    else if (lastResult?.status?.id >= 7 && lastResult?.status?.id <= 12) verdict = 'Runtime Error';
    else if (lastResult?.status?.id === 5) verdict = 'Time Limit Exceeded';
    else verdict = 'Wrong Answer';
  }

  return {
    verdict,
    testsPassed: passed,
    totalTests,
    executionTimeMs: Math.round(totalTimeMs),
    memoryKb: maxMemoryKb,
  };
}

module.exports = { isConfigured, isSupportedByJudge0, runCode, gradeSubmission, LANGUAGE_IDS };
