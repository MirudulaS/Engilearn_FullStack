import api from './api';

export async function getMyAchievements() {
  const { data } = await api.get('/achievements/me');
  return data.achievements;
}
