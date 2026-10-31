const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/User');
const User = require('../src/models/User');

describe('POST /api/auth/register', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects a request missing required fields with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a password under 8 characters with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'a@b.com', password: 'short', department: 'it' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/8 characters/);
  });

  it('rejects a duplicate email with 409', async () => {
    User.findOne.mockResolvedValue({ _id: 'existing' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Aditi',
      email: 'aditi@example.com',
      password: 'password123',
      department: 'it',
    });

    expect(res.status).toBe(409);
  });

  it('creates a user and returns a token on success', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'u1',
      toPublicJSON: () => ({ id: 'u1', name: 'Aditi', email: 'aditi@example.com', department: 'it' }),
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Aditi',
      email: 'aditi@example.com',
      password: 'password123',
      department: 'it',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('aditi@example.com');
  });
});

describe('POST /api/auth/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects a request missing fields with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns the same generic error for a nonexistent user and a wrong password', async () => {
    User.findOne.mockReturnValue({ select: () => Promise.resolve(null) });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever123' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password.');
  });

  it('logs in successfully with correct credentials', async () => {
    User.findOne.mockReturnValue({
      select: () =>
        Promise.resolve({
          _id: 'u1',
          matchPassword: () => Promise.resolve(true),
          toPublicJSON: () => ({ id: 'u1', name: 'Aditi', email: 'aditi@example.com' }),
        }),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'aditi@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('GET /api/auth/me', () => {
  it('rejects a request with no token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a request with a garbage token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
