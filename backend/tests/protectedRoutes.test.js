const request = require('supertest');
const app = require('../src/app');

describe('Protected routes reject requests with no token', () => {
  const cases = [
    ['get', '/api/auth/me'],
    ['post', '/api/compiler/run'],
    ['post', '/api/submissions'],
    ['get', '/api/submissions/me'],
    ['post', '/api/progress/modules/some-module/complete'],
    ['get', '/api/progress/modules'],
    ['get', '/api/progress/me'],
    ['get', '/api/progress/problems'],
    ['get', '/api/progress/subjects'],
    ['get', '/api/achievements/me'],
    ['get', '/api/activity/me'],
    ['get', '/api/recommendations/me'],
  ];

  it.each(cases)('%s %s -> 401', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
