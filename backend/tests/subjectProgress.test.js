const request = require('supertest');
const app = require('../src/app');
const Module = require('../src/models/Module');
const ModuleProgress = require('../src/models/ModuleProgress');
const { verifyToken } = require('../src/utils/token');
const User = require('../src/models/User');
const { updateStreak } = require('../src/utils/streak');

jest.mock('../src/models/Module');
jest.mock('../src/models/ModuleProgress');
jest.mock('../src/models/User');
jest.mock('../src/utils/token');
jest.mock('../src/utils/streak');

afterEach(() => jest.clearAllMocks());

function mockAuthenticatedUser() {
  verifyToken.mockReturnValue({ id: 'u1' });
  User.findById.mockResolvedValue({ _id: 'u1', save: jest.fn() });
  updateStreak.mockResolvedValue(false);
}

describe('GET /api/progress/subjects', () => {
  it('computes percent and level per subject, omitting untouched subjects', async () => {
    mockAuthenticatedUser();

    const jsModules = [
      { _id: 'js-1', subject: 'JavaScript' },
      { _id: 'js-2', subject: 'JavaScript' },
    ];
    const htmlModules = [{ _id: 'html-1', subject: 'HTML' }];
    Module.find.mockReturnValue({ select: jest.fn().mockResolvedValue([...jsModules, ...htmlModules]) });

    // Completed 1 of 2 JavaScript modules, 0 of 1 HTML modules.
    ModuleProgress.find.mockResolvedValue([{ module: 'js-1' }]);

    const res = await request(app).get('/api/progress/subjects').set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    const js = res.body.subjects.find((s) => s.subject === 'JavaScript');
    expect(js.percent).toBe(50);
    expect(js.level).toBe('Intermediate');
    // HTML has zero completed modules — should not appear at all.
    expect(res.body.subjects.find((s) => s.subject === 'HTML')).toBeUndefined();
  });

  it('marks a fully completed subject as Advanced', async () => {
    mockAuthenticatedUser();
    Module.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'vlsi-1', subject: 'VLSI' }]) });
    ModuleProgress.find.mockResolvedValue([{ module: 'vlsi-1' }]);

    const res = await request(app).get('/api/progress/subjects').set('Authorization', 'Bearer token');

    const vlsi = res.body.subjects.find((s) => s.subject === 'VLSI');
    expect(vlsi.percent).toBe(100);
    expect(vlsi.level).toBe('Advanced');
  });
});
