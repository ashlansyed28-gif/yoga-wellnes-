const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to fetch token from localStorage or return default demo bearer
 */
export function getAuthToken() {
  const customToken = localStorage.getItem('prana_auth_token');
  if (customToken) return customToken;

  const sessionStr = localStorage.getItem('sb-zewjinhymoezmucxypdc-auth-token');
  if (sessionStr) {
    try {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.access_token) return parsed.access_token;
    } catch (e) {}
  }

  // Return demo token for immediate exploration
  return 'demo-token';
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Server request failed');
  }
  return data;
}

export const api = {
  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Onboarding
  submitOnboarding: (payload) =>
    request('/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Sessions & Gamification
  completeSession: (session_type, duration_minutes, pose_feedback = null) =>
    request('/sessions/complete', {
      method: 'POST',
      body: JSON.stringify({ session_type, duration_minutes, pose_feedback })
    }),

  getSessionHistory: () => request('/sessions/history'),

  // Experts & Consultations
  getExperts: () => request('/experts'),

  bookConsultation: (payload) =>
    request('/consultations/book', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMyConsultations: () => request('/consultations/my'),

  // AI Features
  sendAIChat: (message, history = []) =>
    request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history })
    }),

  analyzePoseCorrection: (image, pose_name) =>
    request('/ai/pose-correction', {
      method: 'POST',
      body: JSON.stringify({ image, pose_name })
    }),

  regeneratePlan: () =>
    request('/ai/regenerate-plan', {
      method: 'POST'
    }),

  // Community
  getCommunityFeed: () => request('/community'),

  createCommunityPost: (payload) =>
    request('/community/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  likePost: (id) =>
    request(`/community/posts/${id}/like`, {
      method: 'POST'
    })
};
