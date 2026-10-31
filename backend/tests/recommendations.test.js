const request = require('supertest');
const app = require('../src/app');
const ModuleProgress = require('../src/models/ModuleProgress');
const Module = require('../src/models/Module');
const { verifyToken } = require('../src/utils/token');
const User = require('../src/models/User');
const { updateStreak } = require('../src/utils/streak');

jest.mock('../src/models/ModuleProgress');
jest.mock('../src/models/Module');
jest.mock('../src/models/User');
jest.mock('../src/utils/token');
jest.mock('../src/utils/streak');

afterEach(() => jest.clearAllMocks());

function mockAuthenticatedUser(department = 'it') {
  verifyToken.mockReturnValue({ id: 'u1' });
  User.findById.mockResolvedValue({ _id: 'u1', department, save: jest.fn() });
  updateStreak.mockResolvedValue(false);
}

const itWebDevModules = [
  { _id: 'html-structure', departmentId: 'it', categoryId: 'web-development', order: 1, title: 'HTML Structure' },
  { _id: 'css-flexbox', departmentId: 'it', categoryId: 'web-development', order: 2, title: 'Flexbox Layout' },
  { _id: 'js-arrays', departmentId: 'it', categoryId: 'web-development', order: 3, title: 'Arrays & Iteration' },
];
const eceModule = { _id: 'cmos-fundamentals', departmentId: 'ece', categoryId: 'vlsi', order: 1, title: 'CMOS Fundamentals' };

describe('GET /api/recommendations/me', () => {
  it('continues with the next module in order after the most recently completed one', async () => {
    mockAuthenticatedUser();
    ModuleProgress.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ module: 'html-structure', completedAt: new Date() }]),
    });
    Module.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([...itWebDevModules, eceModule]) });

    const res = await request(app).get('/api/recommendations/me').set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body.continueLearning.moduleId).toBe('css-flexbox');
  });

  it('falls back to the first incomplete module in the user\'s own department when nothing is completed', async () => {
    mockAuthenticatedUser('it');
    ModuleProgress.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    Module.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([...itWebDevModules, eceModule]) });

    const res = await request(app).get('/api/recommendations/me').set('Authorization', 'Bearer token');

    expect(res.body.continueLearning.moduleId).toBe('html-structure');
    expect(res.body.continueLearning.departmentId).toBe('it');
  });

  it('recommends at most one module per category and excludes the continue-learning module', async () => {
    mockAuthenticatedUser('it');
    ModuleProgress.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    Module.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([...itWebDevModules, eceModule]) });

    const res = await request(app).get('/api/recommendations/me').set('Authorization', 'Bearer token');

    const recommendedIds = res.body.recommended.map((r) => r.id);
    expect(recommendedIds).not.toContain('html-structure'); // that's the continueLearning module
    expect(recommendedIds).not.toContain('css-flexbox'); // same category as html-structure, already represented
    expect(recommendedIds).toContain('cmos-fundamentals'); // a different department, should appear
  });
});
