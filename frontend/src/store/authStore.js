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
                    
                    // Decode token or fetch user profile immediately after login if needed
                    // For now, we assume we fetch profile separately or backend sends it
                    // Let's fetch profile to get full name, etc.
                    localStorage.setItem('accessToken', access); // Need this for the next req
                    localStorage.setItem('refreshToken', refresh);
                    
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
                        isLoading: false 
                    });
                    return false;
                }
            },

            // Signup Action
            signup: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    // Map frontend fields to backend Serializer fields
                    const payload = {
                        email: userData.email,
                        full_name: userData.fullName,
                        password: userData.password,
                        password2: userData.confirmPassword, // Backend expects 'password2'
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

            // Logout Action
            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
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
