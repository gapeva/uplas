import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (zustand persists there)
    const authData = localStorage.getItem('uplas-auth')
    if (authData) {
      try {
        const { state } = JSON.parse(authData)
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`
        }
      } catch (e) {
        console.error('Failed to parse auth data:', e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authData = localStorage.getItem('uplas-auth')
        if (authData) {
          const { state } = JSON.parse(authData)
          if (state?.refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/v1/auth/token/refresh/`, {
              refresh: state.refreshToken,
            })

            const { access, refresh } = response.data
            
            // Update stored tokens
            const newState = {
              ...state,
              accessToken: access,
              refreshToken: refresh || state.refreshToken,
            }
            localStorage.setItem('uplas-auth', JSON.stringify({ state: newState }))

            processQueue(null, access)
            originalRequest.headers.Authorization = `Bearer ${access}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Clear auth on refresh failure
        localStorage.removeItem('uplas-auth')
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
