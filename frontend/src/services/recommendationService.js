import api from './api';

export async function getMyRecommendations() {
  const { data } = await api.get('/recommendations/me');
  return { continueLearning: data.continueLearning, recommended: data.recommended };
}
