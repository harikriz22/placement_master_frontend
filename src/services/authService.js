import api from './api';

const STORAGE_TOKEN_KEY = 'placement_tracker_auth_token';

// Register member
export async function registerMember({
  name,
  email,
  password,
  invite_code,
}) {
  const response = await api.post('/auth/register/', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    invite_code,
  });

  return response.data;
}

// Login member
export async function loginMember({ email, password }) {
  const response = await api.post(
    '/auth/login/',
    {
      email: email.trim().toLowerCase(),
      password,
    },
    {
      withCredentials: true,
    }
  );

  const { access, member } = response.data.data;

  localStorage.setItem(STORAGE_TOKEN_KEY, access);

  return {
    user: member,
    token: access,
  };
}

// Get current logged-in member
export async function getCurrentUser() {
  let token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  try {
    const response = await api.get('/auth/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;

  } catch (error) {
    if (error.response?.status !== 401) {
      throw error;
    }

    // Access token expired. Try refreshing it.
    token = await refreshAccessToken();

    // Retry current user request with the new token.
    const response = await api.get('/auth/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }
}

// Get stored access token
export function getAuthToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

// Refresh access token
export async function refreshAccessToken() {
  const response = await api.post(
    '/auth/refresh/',
    {},
    {
      withCredentials: true,
    }
  );

  const newAccessToken = response.data.data.access;

  localStorage.setItem(STORAGE_TOKEN_KEY, newAccessToken);

  return newAccessToken;
}

// Logout member
export async function logoutMember() {
  try {
    const token = getAuthToken();

    if (token) {
      await api.post(
        '/auth/logout/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    }
  } finally {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }
}

// Clear authentication data
export function clearAuthData() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}