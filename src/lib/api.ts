import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: { name: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
  
  createUser: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => api.post('/auth/create-user', data),
};

// Blog API
export const blogApi = {
  getBlogs: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
    search?: string;
    category?: string;
  }) => api.get('/blog', { params }),
  
  getBlog: (id: string) =>
    api.get(`/blog/${id}`),
  
  createBlog: (data: Record<string, unknown>) =>
    api.post('/blog', data),
  
  updateBlog: (id: string, data: Record<string, unknown>) =>
    api.put(`/blog/${id}`, data),
  
  deleteBlog: (id: string) =>
    api.delete(`/blog/${id}`),
  
  getBlogStats: () =>
    api.get('/blog/admin/stats'),
};

// Content API
export const contentApi = {
  getPageContent: (page: string, section?: string) =>
    api.get(`/content/page/${page}`, { params: { section } }),
  
  getAllPages: () =>
    api.get('/content/pages'),
  
  updateContent: (data: {
    page: string;
    section: string;
    key: string;
    type: string;
    value: string;
    metadata?: Record<string, unknown>;
  }) => api.put('/content', data),
  
  bulkUpdateContent: (data: { updates: Record<string, unknown>[] }) =>
    api.put('/content/bulk', data),
  
  deleteContent: (id: string) =>
    api.delete(`/content/${id}`),
  
  getContentHistory: (params?: {
    page?: string;
    section?: string;
    key?: string;
  }) => api.get('/content/history', { params }),
};

// Upload API
export const uploadApi = {
  uploadFile: (file: File, metadata?: { alt?: string; caption?: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata?.alt) formData.append('alt', metadata.alt);
    if (metadata?.caption) formData.append('caption', metadata.caption);
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getMedia: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }) => api.get('/upload/media', { params }),
  
  updateMedia: (id: string, data: { alt?: string; caption?: string }) =>
    api.put(`/upload/media/${id}`, data),
  
  deleteMedia: (id: string) =>
    api.delete(`/upload/media/${id}`),
  
  getMediaStats: () =>
    api.get('/upload/media/stats'),
};

// Tours API
export const toursApi = {
  getTours: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/tours', { params }),

  getPublicTours: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/tours/public', { params }),

  getToursByCategory: () => api.get('/tours/public/categories'),

  getTour: (id: string) => api.get(`/tours/${id}`),

  getPublicTour: (id: string) => api.get(`/tours/public/${id}`),

  createTour: (data: Record<string, unknown>) => api.post('/tours', data),

  updateTour: (id: string, data: Record<string, unknown>) => api.put(`/tours/${id}`, data),

  deleteTour: (id: string) => api.delete(`/tours/${id}`),

  getTourStats: () => api.get('/tours/stats'),
};

// Categories API
export const categoriesApi = {
  getCategories: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/categories', { params }),

  getPublicCategories: (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  }) => api.get('/categories/public', { params }),

  getCategory: (id: string) => api.get(`/categories/${id}`),

  getPublicCategory: (id: string) => api.get(`/categories/public/${id}`),

  createCategory: (data: Record<string, unknown>) => api.post('/categories', data),

  updateCategory: (id: string, data: Record<string, unknown>) => api.put(`/categories/${id}`, data),

  deleteCategory: (id: string) => api.delete(`/categories/${id}`),

  getCategoryStats: () => api.get('/categories/stats'),
};