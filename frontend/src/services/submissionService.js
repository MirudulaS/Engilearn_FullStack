import api from './api';

export async function listMySubmissions(problemId) {
  const params = problemId ? { problemId } : undefined;
  const { data } = await api.get('/submissions/me', { params });
  return data.submissions;
}
