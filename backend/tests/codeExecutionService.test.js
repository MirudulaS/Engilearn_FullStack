jest.mock('../src/services/mockJudge');
jest.mock('../src/services/judge0Service');

const mockJudge = require('../src/services/mockJudge');
const judge0 = require('../src/services/judge0Service');
const codeExecution = require('../src/services/codeExecutionService');

afterEach(() => jest.clearAllMocks());

describe('codeExecutionService.runCode', () => {
  it('uses the mock judge when Judge0 does not support the language', async () => {
    judge0.isSupportedByJudge0.mockReturnValue(false);
    mockJudge.runCode.mockResolvedValue({ status: 'success', stdout: 'mocked' });

    const result = await codeExecution.runCode({ language: 'verilog', code: 'x', input: '' });

    expect(judge0.runCode).not.toHaveBeenCalled();
    expect(mockJudge.runCode).toHaveBeenCalled();
    expect(result.stdout).toBe('mocked');
  });

  it('uses Judge0 when the language is supported', async () => {
    judge0.isSupportedByJudge0.mockReturnValue(true);
    judge0.runCode.mockResolvedValue({ status: 'success', stdout: 'real output' });

    const result = await codeExecution.runCode({ language: 'javascript', code: 'x', input: '' });

    expect(judge0.runCode).toHaveBeenCalled();
    expect(mockJudge.runCode).not.toHaveBeenCalled();
    expect(result.stdout).toBe('real output');
  });

  it('falls back to the mock judge if Judge0 throws', async () => {
    judge0.isSupportedByJudge0.mockReturnValue(true);
    judge0.runCode.mockRejectedValue(new Error('network error'));
    mockJudge.runCode.mockResolvedValue({ status: 'success', stdout: 'fallback' });

    const result = await codeExecution.runCode({ language: 'javascript', code: 'x', input: '' });

    expect(result.stdout).toBe('fallback');
  });
});
