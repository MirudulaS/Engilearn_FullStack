const mockJudge = require('../src/services/mockJudge');

describe('mockJudge.runCode', () => {
  it('returns an error result for empty code', async () => {
    const result = await mockJudge.runCode({ language: 'javascript', code: '', input: '' });
    expect(result.status).toBe('error');
  });

  it('returns a success result for non-empty code', async () => {
    const result = await mockJudge.runCode({ language: 'javascript', code: 'console.log(1)', input: '' });
    expect(result.status).toBe('success');
    expect(typeof result.executionTimeMs).toBe('number');
  });
});

describe('mockJudge.gradeSubmission', () => {
  const problem = { examples: [{ input: '1', output: '1' }, { input: '2', output: '2' }] };

  it('returns Wrong Answer for empty code', async () => {
    const result = await mockJudge.gradeSubmission({ problem, code: '' });
    expect(result.verdict).toBe('Wrong Answer');
    expect(result.testsPassed).toBe(0);
  });

  it('returns Accepted with all tests passed for non-empty code', async () => {
    const result = await mockJudge.gradeSubmission({ problem, code: 'function f() {}' });
    expect(result.verdict).toBe('Accepted');
    expect(result.testsPassed).toBe(result.totalTests);
    expect(result.totalTests).toBe(problem.examples.length);
  });

  it('falls back to 3 total tests when a problem has no examples', async () => {
    const result = await mockJudge.gradeSubmission({ problem: {}, code: 'x' });
    expect(result.totalTests).toBe(3);
  });
});
