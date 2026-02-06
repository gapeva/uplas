import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      
      clearAuth: () => set({ 
        user: null, 
        accessToken: null, 
        refreshToken: null, 
        isAuthenticated: false,
        error: null 
      }),

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        // Test mode: allow any login with valid format for testing without database
        const TEST_MODE = false
        if (TEST_MODE && email && password) {
          const mockUser = {
            id: '1',
            email: email,
            full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          }
          set({ 
            accessToken: 'test_access_token',
            refreshToken: 'test_refresh_token',
            user: mockUser,
            isAuthenticated: true,
            isLoading: false 
          })
          return { success: true, user: mockUser }
        }
        
        try {
          const response = await api.post('/v1/auth/login/', { email, password })
          const { access, refresh, user } = response.data
          
          set({ 
            accessToken: access,
            refreshToken: refresh,
            user,
            isAuthenticated: true,
            isLoading: false 
          })
          
          return { success: true, user }
        } catch (error) {
          const message = error.response?.data?.detail || 'Login failed. Please check your credentials.'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        // Test mode: simulate successful registration without database
        const TEST_MODE = false
        if (TEST_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
          set({ isLoading: false })
          return { success: true, data: { message: 'User registered successfully (Test Mode)' } }
        }
        
        // Map frontend field names to backend expected names
        const backendData = {
          email: userData.email,
          full_name: userData.full_name,
          password: userData.password,
          password2: userData.password, // Backend expects password2 for confirmation
          phone_number: userData.phone || '',
          organization: userData.organization || '',
          industry: userData.industry || '',
          profession: userData.profession || '',
        }
        
        try {
          const response = await api.post('/v1/auth/register/', backendData)
          set({ isLoading: false })
          return { success: true, data: response.data }
        } catch (error) {
          let message = 'Registration failed.'
          if (error.response?.data) {
            const errors = error.response.data
            if (typeof errors === 'object') {
              message = Object.entries(errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('; ')
            } else if (errors.detail) {
              message = errors.detail
            }
          }
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      logout: async () => {
        const { refreshToken } = get()
        try {
          if (refreshToken) {
            await api.post('/v1/auth/logout/', { refresh: refreshToken })
          }
        } catch (error) {
          console.warn('Logout API call failed:', error)
        } finally {
          get().clearAuth()
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return null
        
        try {
          const response = await api.post('/v1/auth/token/refresh/', { refresh: refreshToken })
          const { access, refresh } = response.data
          set({ accessToken: access, refreshToken: refresh || refreshToken })
          return access
        } catch (error) {
          get().clearAuth()
          return null
        }
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/v1/auth/profile/')
          set({ user: response.data })
          return response.data
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          return null
        }
      },

      initializeAuth: async () => {
        const { accessToken, refreshToken, fetchProfile, refreshAccessToken } = get()
        
        if (!refreshToken) {
          get().clearAuth()
          return false
        }

        if (accessToken) {
          const profile = await fetchProfile()
          if (profile) return true
        }

        const newToken = await refreshAccessToken()
        if (newToken) {
          const profile = await fetchProfile()
          return !!profile
        }

        return false
      }
    }),
    {
      name: 'uplas-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
