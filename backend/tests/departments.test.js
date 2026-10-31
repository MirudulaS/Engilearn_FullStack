const request = require('supertest');
const app = require('../src/app');
const Department = require('../src/models/Department');

jest.mock('../src/models/Department');

afterEach(() => jest.clearAllMocks());

describe('GET /api/departments', () => {
  it('returns the list of departments', async () => {
    Department.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { _id: 'it', code: 'IT', name: 'Information Technology', categories: [] },
      ]),
    });

    const res = await request(app).get('/api/departments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.departments)).toBe(true);
  });
});

describe('GET /api/departments/:id', () => {
  it('returns the department when found', async () => {
    Department.findById.mockResolvedValue({ _id: 'it', code: 'IT', categories: [] });

    const res = await request(app).get('/api/departments/it');
    expect(res.status).toBe(200);
    expect(res.body.department.code).toBe('IT');
  });
});
