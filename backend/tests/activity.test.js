const request = require('supertest');
const app = require('../src/app');
const Submission = require('../src/models/Submission');
const ModuleProgress = require('../src/models/ModuleProgress');
const UserAchievement = require('../src/models/UserAchievement');
const Problem = require('../src/models/Problem');
const Module = require('../src/models/Module');
const { verifyToken } = require('../src/utils/token');
const User = require('../src/models/User');
const { updateStreak } = require('../src/utils/streak');

jest.mock('../src/models/Submission');
jest.mock('../src/models/ModuleProgress');
jest.mock('../src/models/UserAchievement');
jest.mock('../src/models/Problem');
jest.mock('../src/models/Module');
jest.mock('../src/models/User');
jest.mock('../src/utils/token');
jest.mock('../src/utils/streak');

afterEach(() => jest.clearAllMocks());

function mockAuthenticatedUser() {
  verifyToken.mockReturnValue({ id: 'u1' });
  User.findById.mockResolvedValue({ _id: 'u1', save: jest.fn() });
  updateStreak.mockResolvedValue(false);
}

function chainable(sortResult) {
  return { sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(sortResult) }) };
}

describe('GET /api/activity/me', () => {
  it('merges submissions, module completions, and achievements sorted by time', async () => {
    mockAuthenticatedUser();

    Submission.find.mockReturnValue(
      chainable([{ _id: 's1', problem: 'reverse-a-string', verdict: 'Accepted', createdAt: new Date('2026-01-03') }])
    );
    ModuleProgress.find.mockReturnValue(
      chainable([{ _id: 'mp1', module: 'html-structure', completedAt: new Date('2026-01-02') }])
    );
    UserAchievement.find.mockReturnValue(
      chainable([{ _id: 'a1', achievementId: 'first-solve', earnedAt: new Date('2026-01-01') }])
    );
    Problem.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'reverse-a-string', title: 'Reverse a String', subject: 'JavaScript' }]) });
    Module.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'html-structure', title: 'HTML Structure', subject: 'HTML' }]) });

    const res = await request(app).get('/api/activity/me').set('Authorization', 'Bearer faketoken');

    expect(res.status).toBe(200);
    expect(res.body.activity).toHaveLength(3);
    // Most recent first.
    expect(res.body.activity[0].type).toBe('submission');
    expect(res.body.activity[0].label).toMatch(/Solved "Reverse a String"/);
    expect(res.body.activity[1].label).toMatch(/Completed "HTML Structure"/);
    expect(res.body.activity[2].label).toMatch(/Earned "First Problem Solved"/);
  });

  it('returns an empty list for a user with no activity yet', async () => {
    mockAuthenticatedUser();
    Submission.find.mockReturnValue(chainable([]));
    ModuleProgress.find.mockReturnValue(chainable([]));
    UserAchievement.find.mockReturnValue(chainable([]));
    Problem.find.mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    Module.find.mockReturnValue({ select: jest.fn().mockResolvedValue([]) });

    const res = await request(app).get('/api/activity/me').set('Authorization', 'Bearer faketoken');

    expect(res.status).toBe(200);
    expect(res.body.activity).toEqual([]);
  });
});
