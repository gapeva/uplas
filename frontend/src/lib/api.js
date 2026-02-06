import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // Update header and retry original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/#auth-section'; // Redirect to login
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
