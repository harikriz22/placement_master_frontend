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

// Fetch all batches
export async function listBatches() {
  const response = await authenticatedRequest({
    method: 'GET',
    url: '/batches/',
  });

  return response.data.data;
}

// Fetch all courses
export async function listCourses() {
  const response = await authenticatedRequest({
    method: 'GET',
    url: '/batches/courses/',
  });

  return response.data.data;
}

// Fetch one batch
export async function getBatch(id) {
  const response = await authenticatedRequest({
    method: 'GET',
    url: `/batches/${id}/`,
  });

  return response.data.data;
}

// Create batch
export async function addBatch(data) {
  const response = await authenticatedRequest({
    method: 'POST',
    url: '/batches/',
    data,
  });

  return response.data.data;
}

// Update batch
export async function updateBatch(id, data) {
  const response = await authenticatedRequest({
    method: 'PATCH',
    url: `/batches/${id}/`,
    data,
  });

  return response.data.data;
}

// Fetch students in a batch
export async function getBatchStudents(id) {
  const response = await authenticatedRequest({
    method: 'GET',
    url: `/batches/${id}/students/`,
  });

  return response.data.data;
}