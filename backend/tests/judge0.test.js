// These tests mock global.fetch and never touch a real Judge0 instance —
// they verify the request is shaped correctly and the response is parsed
// correctly against Judge0's documented contract, not that the contract
// itself is right. See src/services/judge0Service.js for the honest status.

jest.mock('../src/config/env', () => ({
  judge0ApiUrl: 'https://judge0-ce.p.rapidapi.com',
  judge0ApiKey: 'test-key',
  judge0ApiHost: 'judge0-ce.p.rapidapi.com',
}));

const judge0 = require('../src/services/judge0Service');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('judge0Service.isSupportedByJudge0', () => {
  it('supports general-purpose languages when configured', () => {
    expect(judge0.isSupportedByJudge0('javascript')).toBe(true);
    expect(judge0.isSupportedByJudge0('python')).toBe(true);
  });

  it('does not claim support for HTML/CSS/SQL/Verilog', () => {
    expect(judge0.isSupportedByJudge0('html')).toBe(false);
    expect(judge0.isSupportedByJudge0('css')).toBe(false);
    expect(judge0.isSupportedByJudge0('sql')).toBe(false);
    expect(judge0.isSupportedByJudge0('verilog')).toBe(false);
  });
});

describe('judge0Service.runCode', () => {
  it('sends the expected request shape and parses a successful response', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        stdout: 'hello\n',
        stderr: '',
        status: { id: 3, description: 'Accepted' },
        time: '0.02',
        memory: 3480,
      }),
    });

    const result = await judge0.runCode({ language: 'javascript', code: 'console.log("hello")', input: '' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/submissions');
    expect(url).toContain('wait=true');
    expect(options.headers['X-RapidAPI-Key']).toBe('test-key');
    const body = JSON.parse(options.body);
    expect(body.language_id).toBe(63); // Node.js in Judge0's language table
    expect(body.source_code).toBe('console.log("hello")');

    expect(result.status).toBe('success');
    expect(result.stdout).toBe('hello\n');
    expect(result.executionTimeMs).toBe(20);
  });

  it('reports failure when Judge0 returns a non-Accepted status', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        stdout: '',
        stderr: 'SyntaxError: Unexpected token',
        status: { id: 6, description: 'Compilation Error' },
        time: null,
        memory: null,
      }),
    });

    const result = await judge0.runCode({ language: 'javascript', code: 'const =;', input: '' });
    expect(result.status).toBe('error');
    expect(result.stderr).toMatch(/SyntaxError/);
  });

  it('throws when the HTTP request itself fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 503 });
    await expect(judge0.runCode({ language: 'javascript', code: 'x', input: '' })).rejects.toThrow(/503/);
  });
});

describe('judge0Service.gradeSubmission', () => {
  it('marks Accepted only when every example output matches exactly', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ stdout: '3\n', status: { id: 3 }, time: '0.01', memory: 3000 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ stdout: '3\n', status: { id: 3 }, time: '0.01', memory: 3000 }) });

    const problem = { examples: [{ input: '1 2', output: '3' }, { input: '1 2', output: '3' }] };
    const result = await judge0.gradeSubmission({ problem, code: 'code here', language: 'python' });

    expect(result.verdict).toBe('Accepted');
    expect(result.testsPassed).toBe(2);
    expect(result.totalTests).toBe(2);
  });

  it('marks Wrong Answer when output does not match', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ stdout: '4\n', status: { id: 3 }, time: '0.01', memory: 3000 }),
    });

    const problem = { examples: [{ input: '1 2', output: '3' }] };
    const result = await judge0.gradeSubmission({ problem, code: 'buggy code', language: 'python' });

    expect(result.verdict).toBe('Wrong Answer');
    expect(result.testsPassed).toBe(0);
  });
});
