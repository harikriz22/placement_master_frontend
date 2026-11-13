import api from './api';
import { getAuthToken, refreshAccessToken } from './authService';

async function authenticatedRequest(config) {
  let token = getAuthToken();

  try {
    return await api({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response?.status !== 401) {
      throw error;
    }

    token = await refreshAccessToken();

    return api({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export async function getDashboardCounts() {
  const response = await authenticatedRequest({
    method: 'GET',
    url: '/dashboard/',
  });

  const data = response.data.data;

  return {
    totalEnrolled: data.enrolled,
    eligible: data.eligible,
    notEligible: data.not_eligible,
    dropped: data.dropped,
    batchSwitch: data.batch_switch,
    rejoined: data.rejoined,
    placed: data.placed,
  };
}