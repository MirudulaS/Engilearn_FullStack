const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/Problem');
jest.mock('../src/models/Department');
const Problem = require('../src/models/Problem');
const Department = require('../src/models/Department');

describe('GET /api/problems', () => {
  afterEach(() => jest.clearAllMocks());

  it('lists problems and applies query filters', async () => {
    const mockProblems = [{ _id: 'p1', title: 'Reverse a String', difficulty: 'easy' }];
    Problem.find.mockReturnValue({ sort: () => Promise.resolve(mockProblems) });

    const res = await request(app).get('/api/problems').query({ department: 'it', difficulty: 'easy' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(Problem.find).toHaveBeenCalledWith(
      expect.objectContaining({ departmentId: 'it', difficulty: 'easy' })
    );
  });
});

describe('GET /api/problems/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 404 for an unknown problem id', async () => {
    Problem.findById.mockResolvedValue(null);
    const res = await request(app).get('/api/problems/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns the problem when found', async () => {
    Problem.findById.mockResolvedValue({ _id: 'reverse-a-string', title: 'Reverse a String' });
    const res = await request(app).get('/api/problems/reverse-a-string');
    expect(res.status).toBe(200);
    expect(res.body.problem.title).toBe('Reverse a String');
  });
});

describe('GET /api/departments/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 404 for an unknown department', async () => {
    Department.findById.mockResolvedValue(null);
    const res = await request(app).get('/api/departments/nonsense');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/No department found/);
  });
});
