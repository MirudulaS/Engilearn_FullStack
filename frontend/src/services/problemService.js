import api from './api';

// filters: { department, category, module, difficulty, q }
export async function listProblems(filters = {}) {
  const params = {};
  if (filters.departmentId) params.department = filters.departmentId;
  if (filters.categoryId) params.category = filters.categoryId;
  if (filters.moduleId) params.module = filters.moduleId;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.query) params.q = filters.query;

  const { data } = await api.get('/problems', { params });
  return data.problems;
}

export async function getProblem(id) {
  const { data } = await api.get(`/problems/${id}`);
  return data.problem;
}
