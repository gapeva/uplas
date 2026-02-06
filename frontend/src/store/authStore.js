import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login Action
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login/', { email, password });
                    const { access, refresh } = response.data;
                    
                    // Fetch user profile immediately
                    // Note: We temporarily set token in state so the subsequent profile fetch works (if api.js reads from state)
                    set({ accessToken: access, refreshToken: refresh });

                    const profileRes = await api.get('/auth/profile/');
                    
                    set({ 
                        user: profileRes.data, 
                        accessToken: access, 
                        refreshToken: refresh, 
                        isAuthenticated: true, 
                        isLoading: false 
                    });
                    return true;
                } catch (error) {
                    set({ 
                        error: error.response?.data?.detail || 'Login failed', 
                        isLoading: false,
                        accessToken: null,
                        refreshToken: null
                    });
                    return false;
                }
            },

            // Signup Action
            signup: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const payload = {
                        email: userData.email,
                        full_name: userData.fullName,
                        password: userData.password,
                        password2: userData.confirmPassword,
                        phone_number: `${userData.countryCode}${userData.phone}`,
                        organization: userData.organization,
                        industry: userData.industry === 'Other' ? userData.otherIndustry : userData.industry,
                        profession: userData.profession
                    };

                    await api.post('/auth/register/', payload);
                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    set({ 
                        error: error.response?.data?.password?.[0] || 'Registration failed', 
                        isLoading: false 
                    });
                    return { success: false, error: error.response?.data };
                }
            },

            // Internal helper to update tokens silently (used by API interceptor)
            setTokens: (access, refresh) => {
                set({ accessToken: access, refreshToken: refresh });
            },

            // Logout Action
            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
                localStorage.removeItem('auth-storage'); // Clear persist storage
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user, 
                accessToken: state.accessToken, 
                refreshToken: state.refreshToken, 
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);

export default useAuthStore;
