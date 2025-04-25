import axios from 'axios';

/**
 * API Service Configuration
 * 
 * This file configures the connection between your frontend and backend API.
 */

// Determine API URL based on environment variables or use a fallback
let apiUrl = process.env.REACT_APP_API_URL;

// Fallback logic for different environments
if (!apiUrl) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    apiUrl = 'http://localhost:5000/api';
    console.log('Using local API:', apiUrl);
  } else {
    // When deployed on Netlify, connect to Railway backend
    apiUrl = 'https://buildholding-api.up.railway.app/api';
    console.log('Using Railway API:', apiUrl);
  }
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor for JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      // Handle 401 Unauthorized errors (expired token, etc.)
      if (error.response.status === 401) {
        // Clear local storage and redirect to login if token is invalid/expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
      
      // Handle 404 or 500 errors with user-friendly messages
      if (error.response.status === 404 || error.response.status === 500) {
        console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Define common API methods
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
};

export const projectService = {
  getAll: (params) => apiClient.get('/projects', { params }),
  getFeatured: (limit = 5) => apiClient.get('/projects/featured', { params: { limit } }),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
  updateStatus: (id, status, completionPercentage) => 
    apiClient.patch(`/projects/${id}/status`, { status, completionPercentage }),
  toggleFeatured: (id) => apiClient.patch(`/projects/${id}/featured`),
};

export const partnerService = {
  getAll: (params) => apiClient.get('/partners', { params }),
  getFeatured: (limit = 5) => apiClient.get('/partners/featured', { params: { limit } }),
  getById: (id) => apiClient.get(`/partners/${id}`),
  create: (data) => apiClient.post('/partners', data),
  update: (id, data) => apiClient.put(`/partners/${id}`, data),
  delete: (id) => apiClient.delete(`/partners/${id}`),
  toggleFeatured: (id) => apiClient.patch(`/partners/${id}/featured`),
};

export const clientService = {
  getAll: (params) => apiClient.get('/clients', { params }),
  getFeatured: (limit = 5) => apiClient.get('/clients/featured', { params: { limit } }),
  getTestimonials: (limit = 5) => apiClient.get('/clients/testimonials', { params: { limit } }),
  getById: (id) => apiClient.get(`/clients/${id}`),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`),
  toggleFeatured: (id) => apiClient.patch(`/clients/${id}/featured`),
  updateTestimonial: (id, testimonial) => apiClient.patch(`/clients/${id}/testimonial`, { testimonial }),
};

export const timelineService = {
  getAll: (params) => apiClient.get('/timeline', { params }),
  getFeatured: () => apiClient.get('/timeline/featured'),
  getByDecade: (decade) => apiClient.get(`/timeline/decade/${decade}`),
  getById: (id) => apiClient.get(`/timeline/${id}`),
  create: (data) => apiClient.post('/timeline', data),
  update: (id, data) => apiClient.put(`/timeline/${id}`, data),
  delete: (id) => apiClient.delete(`/timeline/${id}`),
  toggleFeatured: (id) => apiClient.patch(`/timeline/${id}/featured`),
};

export const contentService = {
  getAll: (params) => apiClient.get('/content', { params }),
  getByPage: (page, locale) => apiClient.get(`/content/page/${page}`, { params: { locale } }),
  getBySection: (section, locale) => apiClient.get(`/content/section/${section}`, { params: { locale } }),
  getById: (id) => apiClient.get(`/content/${id}`),
  create: (data) => apiClient.post('/content', data),
  update: (id, data) => apiClient.put(`/content/${id}`, data),
  delete: (id) => apiClient.delete(`/content/${id}`),
  updateText: (id, text) => apiClient.patch(`/content/${id}/text`, { text }),
};

export const mediaService = {
  // Special handling for file uploads
  upload: (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add any additional metadata
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
    }
    
    return apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAll: (params) => apiClient.get('/media', { params }),
  getByType: (type, params) => apiClient.get(`/media/type/${type}`, { params }),
  getById: (id) => apiClient.get(`/media/${id}`),
  update: (id, data) => apiClient.put(`/media/${id}`, data),
  delete: (id) => apiClient.delete(`/media/${id}`),
};

// Export the configured axios instance for custom requests
export default apiClient;
