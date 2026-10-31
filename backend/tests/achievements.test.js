const { checkAndAwardAchievements, checkStreakAchievements } = require('../src/services/achievementService');
const UserAchievement = require('../src/models/UserAchievement');
const Submission = require('../src/models/Submission');
const ModuleProgress = require('../src/models/ModuleProgress');
const Module = require('../src/models/Module');
const Department = require('../src/models/Department');

jest.mock('../src/models/UserAchievement');
jest.mock('../src/models/Submission');
jest.mock('../src/models/ModuleProgress');
jest.mock('../src/models/Module');
jest.mock('../src/models/Department');

afterEach(() => jest.clearAllMocks());

describe('checkAndAwardAchievements', () => {
  it('awards "first-solve" on a single accepted submission', async () => {
    UserAchievement.find.mockResolvedValue([]);
    Submission.find.mockResolvedValue([{ problem: 'reverse-a-string', verdict: 'Accepted' }]);
    ModuleProgress.find.mockResolvedValue([]);
    Module.find.mockResolvedValue([]);
    UserAchievement.create.mockResolvedValue({});

    const newlyEarned = await checkAndAwardAchievements('user1');

    expect(newlyEarned).toContain('first-solve');
    expect(UserAchievement.create).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'user1', achievementId: 'first-solve' })
    );
  });

  it('does not re-award an achievement the user already has', async () => {
    UserAchievement.find.mockResolvedValue([{ achievementId: 'first-solve' }]);
    Submission.find.mockResolvedValue([{ problem: 'reverse-a-string', verdict: 'Accepted' }]);
    ModuleProgress.find.mockResolvedValue([]);
    Module.find.mockResolvedValue([]);

    const newlyEarned = await checkAndAwardAchievements('user1');

    expect(newlyEarned).not.toContain('first-solve');
    expect(UserAchievement.create).not.toHaveBeenCalled();
  });

  it('awards subject mastery only once every module of that subject is completed', async () => {
    UserAchievement.find.mockResolvedValue([]);
    Submission.find.mockResolvedValue([]);
    const htmlModules = [
      { _id: 'html-1', subject: 'HTML' },
      { _id: 'html-2', subject: 'HTML' },
    ];
    Module.find.mockResolvedValue(htmlModules);
    Department.find.mockResolvedValue([]);
    UserAchievement.create.mockResolvedValue({});

    ModuleProgress.find.mockResolvedValue([{ module: 'html-1' }]);
    let newlyEarned = await checkAndAwardAchievements('user1');
    expect(newlyEarned).not.toContain('html-master');

    ModuleProgress.find.mockResolvedValue([{ module: 'html-1' }, { module: 'html-2' }]);
    newlyEarned = await checkAndAwardAchievements('user1');
    expect(newlyEarned).toContain('html-master');
  });

  it('awards category completion when every module in a category is done', async () => {
    UserAchievement.find.mockResolvedValue([]);
    Submission.find.mockResolvedValue([]);
    const modules = [
      { _id: 'm1', departmentId: 'it', categoryId: 'web-development', subject: 'HTML' },
    ];
    Module.find.mockResolvedValue(modules);
    ModuleProgress.find.mockResolvedValue([{ module: 'm1' }]);
    Department.find.mockResolvedValue([
      { _id: 'it', categories: [{ id: 'web-development', moduleCount: 1 }] },
    ]);
    UserAchievement.create.mockResolvedValue({});

    const newlyEarned = await checkAndAwardAchievements('user1');
    expect(newlyEarned).toContain('full-module-completion');
  });
});

describe('checkStreakAchievements', () => {
  it('awards the 7-day streak achievement once the threshold is reached', async () => {
    UserAchievement.find.mockResolvedValue([]);
    UserAchievement.create.mockResolvedValue({});

    const newlyEarned = await checkStreakAchievements('user1', 7);
    expect(newlyEarned).toContain('seven-day-streak');
  });

  it('does not award a streak achievement below its threshold', async () => {
    UserAchievement.find.mockResolvedValue([]);

    const newlyEarned = await checkStreakAchievements('user1', 3);
    expect(newlyEarned).not.toContain('seven-day-streak');
    expect(UserAchievement.create).not.toHaveBeenCalled();
  });
});
