import api from './api';

// Auth services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

// Application services
export const applicationService = {
  getAll: (params) => api.get('/applications', { params }),
  getStats: () => api.get('/applications/stats'),
  getUpcomingDeadlines: () => api.get('/applications/upcoming-deadlines'),
  create: (data) => api.post('/applications', data),
  getById: (id) => api.get(`/applications/${id}`),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  exportCSV: () => api.get('/applications/export/csv', { responseType: 'blob' }),
};
