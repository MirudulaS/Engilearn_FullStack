import api from './api';

export async function getMyActivity() {
  const { data } = await api.get('/activity/me');
  return data.activity;
}
