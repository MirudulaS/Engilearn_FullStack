const request = require('supertest');
const app = require('../src/app');

describe('PATCH /api/users/me', () => {
  it('rejects a request with no token with 401', async () => {
    const res = await request(app).patch('/api/users/me').send({ name: 'New Name' });
    expect(res.status).toBe(401);
  });
});
