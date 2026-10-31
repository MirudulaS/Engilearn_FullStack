// compilerService.js
//
// REAL IMPLEMENTATION — calls the EngiLearn backend, which itself still
// uses a mock judge internally (see the backend's src/services/mockJudge.js)
// until a real sandboxed execution service is connected there. Signatures
// kept identical to the earlier frontend-only mock so Compiler.jsx didn't
// need to change.

import api from './api';

export async function runCode({ language, code, input }) {
  const { data } = await api.post('/compiler/run', { language, code, input });
  return data.result;
}

export async function submitCode({ problemId, language, code }) {
  const { data } = await api.post('/submissions', { problemId, language, code });
  const s = data.submission;
  return {
    verdict: s.verdict,
    testsPassed: s.testsPassed,
    totalTests: s.totalTests,
    executionTimeMs: s.executionTimeMs,
    memoryKb: s.memoryKb,
    timestamp: s.createdAt,
  };
}
