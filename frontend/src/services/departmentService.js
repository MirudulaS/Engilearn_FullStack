import api from './api';

export async function listDepartments() {
  const { data } = await api.get('/departments');
  return data.departments;
}

export async function getDepartment(id) {
  const { data } = await api.get(`/departments/${id}`);
  return data.department;
}

export async function listModulesByCategory(departmentId, categoryId) {
  const { data } = await api.get(`/departments/${departmentId}/categories/${categoryId}/modules`);
  return data; // { category, modules }
}
