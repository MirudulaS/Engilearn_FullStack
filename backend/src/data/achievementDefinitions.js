// Achievement definitions live in code, not the database — there are only
// ever a handful of them and they don't change per-user, so a DB collection
// would just be extra indirection. What IS per-user is which ones a given
// user has earned, tracked in the UserAchievement model.

const achievementDefinitions = [
  { id: 'first-solve', title: 'First Problem Solved', description: 'Solve your first practice problem.', type: 'problems-solved', threshold: 1 },
  { id: 'ten-solved', title: '10 Problems Solved', description: 'Solve 10 practice problems.', type: 'problems-solved', threshold: 10 },
  { id: 'fifty-solved', title: '50 Problems Solved', description: 'Solve 50 practice problems.', type: 'problems-solved', threshold: 50 },
  { id: 'html-master', title: 'HTML Master', description: 'Complete every HTML module.', type: 'subject-mastery', subject: 'HTML' },
  { id: 'js-explorer', title: 'JavaScript Explorer', description: 'Complete every JavaScript module.', type: 'subject-mastery', subject: 'JavaScript' },
  { id: 'react-beginner', title: 'React Beginner', description: 'Complete your first React module.', type: 'subject-started', subject: 'React' },
  { id: 'vlsi-starter', title: 'VLSI Starter', description: 'Complete your first VLSI module.', type: 'subject-started', subject: 'VLSI' },
  { id: 'seven-day-streak', title: '7-Day Streak', description: 'Learn something 7 days in a row.', type: 'streak', threshold: 7 },
  { id: 'thirty-day-streak', title: '30-Day Streak', description: 'Learn something 30 days in a row.', type: 'streak', threshold: 30 },
  { id: 'full-module-completion', title: 'Full Module Completion', description: 'Finish every module in a learning category.', type: 'category-completion' },
];

module.exports = achievementDefinitions;
