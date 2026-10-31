import api from './api';

export async function getModule(id) {
  const { data } = await api.get(`/modules/${id}`);
  return data.module;
}
