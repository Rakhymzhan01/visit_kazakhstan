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
    console.log('🌐 [FRONTEND] API Request Starting:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: (config.baseURL || '') + (config.url || ''),
      params: config.params,
      dataSize: config.data ? JSON.stringify(config.data).length : 0
    });
    
    if (config.data) {
      console.log('📝 [FRONTEND] Request Data:', config.data);
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      console.log('🔑 [FRONTEND] Auth Token:', token ? `present (${token.substring(0, 20)}...)` : 'missing');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ [FRONTEND] API Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ [FRONTEND] API Response Received:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataSize: response.data ? JSON.stringify(response.data).length : 0,
      success: response.data?.success
    });
    
    if (response.data) {
      console.log('📦 [FRONTEND] Response Data:', response.data);
    }
    
    return response;
  },
  (error) => {
    console.error('❌ [FRONTEND] API Response Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      baseURL: error.config?.baseURL,
      fullURL: (error.config?.baseURL || '') + (error.config?.url || ''),
      errorData: error.response?.data,
      errorMessage: error.message,
      errorCode: error.code,
      errorStack: error.stack,
      headers: error.response?.headers,
      requestHeaders: error.config?.headers,
      timeout: error.config?.timeout,
      timestamp: new Date().toISOString()
    });

    // Additional debugging information
    console.error('🔍 [FRONTEND] Full error object:', error);
    console.error('🔍 [FRONTEND] Error response:', error.response);
    console.error('🔍 [FRONTEND] Error config:', error.config);
    console.error('🔍 [FRONTEND] Error request:', error.request);

    // Log additional context for network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('🌐 [FRONTEND] Network Error - Backend server might be down:', {
        expectedBackendURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
        errorType: 'CONNECTION_FAILED',
        suggestion: 'Check if backend server is running'
      });
    }

    // Log CORS errors
    if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
      console.error('🚫 [FRONTEND] Possible CORS Error:', {
        frontendOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
        backendURL: error.config?.baseURL,
        suggestion: 'Check CORS configuration on backend'
      });
    }
    
    if (error.response?.status === 401) {
      console.log('🔒 [FRONTEND] Authentication failed, redirecting to login');
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

// Destinations API
export const destinationsApi = {
  getDestinations: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    status?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/destinations', { params }),

  getPublicDestinations: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/destinations/public', { params }),

  getDestination: (id: string) => api.get(`/destinations/${id}`),

  getPublicDestination: (id: string) => api.get(`/destinations/public/${id}`),

  getPublicDestinationBySlug: (slug: string) => api.get(`/destinations/public/slug/${slug}`),

  createDestination: (data: Record<string, unknown>) => api.post('/destinations', data),

  updateDestination: (id: string, data: Record<string, unknown>) => api.put(`/destinations/${id}`, data),

  deleteDestination: (id: string) => api.delete(`/destinations/${id}`),

  getDestinationStats: () => api.get('/destinations/stats'),
};

// Category Page Info API
export const categoryPageInfoApi = {
  getCategoryPageInfos: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get('/category-page-info', { params }),

  getCategoryPageInfoBySlug: (slug: string) => api.get(`/category-page-info/public/${slug}`),

  getCategoryPageInfo: (id: string) => api.get(`/category-page-info/${id}`),

  createCategoryPageInfo: (data: Record<string, unknown>) => api.post('/category-page-info', data),

  updateCategoryPageInfo: (id: string, data: Record<string, unknown>) => api.put(`/category-page-info/${id}`, data),

  deleteCategoryPageInfo: (id: string) => api.delete(`/category-page-info/${id}`),

  getCategoryPageInfoStats: () => api.get('/category-page-info/stats'),
};

// Events API
export const eventsApi = {
  getEvents: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/events', { params }),

  getPublicEvents: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/events/public', { params }),

  getEvent: (id: string) => api.get(`/events/${id}`),

  getPublicEvent: (id: string) => api.get(`/events/public/${id}`),

  getPublicEventBySlug: (slug: string) => api.get(`/events/public/slug/${slug}`),

  createEvent: (data: Record<string, unknown>) => api.post('/events', data),

  updateEvent: (id: string, data: Record<string, unknown>) => api.put(`/events/${id}`, data),

  deleteEvent: (id: string) => api.delete(`/events/${id}`),

  getEventStats: () => api.get('/events/stats'),
};

// Homepage Content API
export const homepageApi = {
  getHomepageContent: () => {
    console.log('🏠 [FRONTEND] HOMEPAGE GET - Fetching data from backend');
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.get('/homepage');
  },

  getPublicHomepageContent: () => {
    console.log('🏠 [FRONTEND] HOMEPAGE PUBLIC GET - Fetching public data from backend');
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.get('/homepage');
  },

  updateHomepageContent: (data: Record<string, unknown>) => {
    console.log('🏠 [FRONTEND] HOMEPAGE UPDATE - Sending request to backend');
    console.log('📝 [FRONTEND] Homepage update data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put('/homepage', data);
  },

  updateHomepageSection: (section: string, data: Record<string, unknown>) => {
    console.log('🏠 [FRONTEND] HOMEPAGE SECTION UPDATE - Sending request to backend');
    console.log('📝 [FRONTEND] Section:', section);
    console.log('📝 [FRONTEND] Section update data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put(`/homepage/${section}`, data);
  },

  updateWhyVisitSection: (data: {
    title?: string;
    features: Array<{
      title: string;
      image: string;
      bgColor: string;
      order: number;
    }>;
  }) => {
    console.log('🏠 [FRONTEND] WHY VISIT SECTION UPDATE - Sending request to backend');
    console.log('📝 [FRONTEND] Why Visit data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put('/homepage/whyVisit', data);
  },

  updateHeroSection: (data: {
    title: string;
    subtitle?: string;
    videoUrl?: string;
    backgroundImage?: string;
  }) => {
    console.log('🏠 [FRONTEND] HERO SECTION UPDATE - Sending request to backend');
    console.log('📝 [FRONTEND] Hero section data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put('/homepage/hero', data);
  },

  createHomepageVersion: () => api.post('/homepage/version'),

  getHomepageVersions: () => api.get('/homepage/versions'),

  activateHomepageVersion: (id: string) => api.put(`/homepage/versions/${id}/activate`),

  getHomepageStats: () => api.get('/homepage/stats'),
};

// About Us API
export const aboutUsApi = {
  getPublicAboutUs: () => {
    console.log('👥 [FRONTEND] ABOUT US PUBLIC - Fetching data from backend');
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.get('/aboutus/public');
  },

  getAboutUsContent: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    version?: number;
  }) => {
    console.log('👥 [FRONTEND] ABOUT US ADMIN - Fetching admin data from backend');
    console.log('📝 [FRONTEND] Params:', params);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.get('/aboutus', { params });
  },

  getAboutUsById: (id: string) => {
    console.log('👥 [FRONTEND] ABOUT US BY ID - Fetching specific about us');
    console.log('📝 [FRONTEND] ID:', id);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.get(`/aboutus/${id}`);
  },

  createAboutUs: (data: Record<string, unknown>) => {
    console.log('👥 [FRONTEND] ABOUT US CREATE - Creating new about us');
    console.log('📝 [FRONTEND] Data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.post('/aboutus', data);
  },

  updateAboutUs: (id: string, data: Record<string, unknown>) => {
    console.log('👥 [FRONTEND] ABOUT US UPDATE - Updating about us');
    console.log('📝 [FRONTEND] ID:', id);
    console.log('📝 [FRONTEND] Data:', data);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put(`/aboutus/${id}`, data);
  },

  deleteAboutUs: (id: string) => {
    console.log('👥 [FRONTEND] ABOUT US DELETE - Deleting about us');
    console.log('📝 [FRONTEND] ID:', id);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.delete(`/aboutus/${id}`);
  },

  publishAboutUs: (id: string) => {
    console.log('👥 [FRONTEND] ABOUT US PUBLISH - Publishing about us');
    console.log('📝 [FRONTEND] ID:', id);
    console.log('⏰ [FRONTEND] Timestamp:', new Date().toISOString());
    return api.put(`/aboutus/${id}/publish`);
  },
};

// Page Categories API (for the /categories page)
export const pageCategoriesApi = {
  getPublicPageCategories: (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  }) => api.get('/page-categories/public', { params }),

  getPageCategories: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
    search?: string;
  }) => api.get('/page-categories', { params }),

  getPageCategoryById: (id: string) => api.get(`/page-categories/${id}`),

  createPageCategory: (data: Record<string, unknown>) => api.post('/page-categories', data),

  updatePageCategory: (id: string, data: Record<string, unknown>) => api.put(`/page-categories/${id}`, data),

  deletePageCategory: (id: string) => api.delete(`/page-categories/${id}`),
};