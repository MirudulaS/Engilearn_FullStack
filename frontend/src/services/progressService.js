import api from './api';

export async function getMyProgress() {
  const { data } = await api.get('/progress/me');
  return data;
}

export async function getProblemStatuses() {
  const { data } = await api.get('/progress/problems');
  return data.statuses; // { [problemId]: 'solved' | 'attempted' | 'unattempted' }
}

export async function getCompletedModuleIds() {
  const { data } = await api.get('/progress/modules');
  return data.completedModuleIds;
}

export async function toggleModuleComplete(moduleId) {
  const { data } = await api.post(`/progress/modules/${moduleId}/complete`);
  return data.completed;
}

export async function getSubjectProgress() {
  const { data } = await api.get('/progress/subjects');
  return data.subjects; // [{ subject, percent, level }]
}
