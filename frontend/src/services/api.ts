import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/auth/token', credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Workflow API
export const workflowAPI = {
  getWorkflows: (params?: { skip?: number; limit?: number }) =>
    api.get('/api/workflows', { params }),
  createWorkflow: (workflowData: any) =>
    api.post('/api/workflows', workflowData),
  getWorkflow: (id: number) => api.get(`/api/workflows/${id}`),
  updateWorkflow: (id: number, workflowData: any) =>
    api.put(`/api/workflows/${id}`, workflowData),
  deleteWorkflow: (id: number) => api.delete(`/api/workflows/${id}`),
  executeWorkflow: (id: number, inputData: any) =>
    api.post(`/api/workflows/${id}/execute`, inputData),
  publishWorkflow: (id: number) =>
    api.post(`/api/workflows/${id}/publish`),
  getWorkflowExecutions: (id: number, params?: { skip?: number; limit?: number }) =>
    api.get(`/api/workflows/${id}/executions`, { params }),
};

// Document API
export const documentAPI = {
  getDocuments: (params?: { skip?: number; limit?: number }) =>
    api.get('/api/documents', { params }),
  uploadDocument: (file: File, title: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    return api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDocument: (id: number) => api.get(`/api/documents/${id}`),
  deleteDocument: (id: number) => api.delete(`/api/documents/${id}`),
  indexDocument: (id: number) => api.post(`/api/documents/${id}/index`),
  queryDocuments: (query: string, topK: number = 5) =>
    api.post('/api/documents/query', { query, top_k: topK }),
};

export default api;