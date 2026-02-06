import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import enTranslations from '../../frontend/locales/en.json'; // Assuming you copied the JSON file

const UplasContext = createContext();

export const UplasProvider = ({ children }) => {
  // --- Auth State ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Theme State ---
  const [theme, setTheme] = useState(localStorage.getItem('uplas-theme') || 'light');

  // --- I18n State ---
  const [language, setLanguage] = useState(localStorage.getItem('uplas-lang') || 'en');
  const [translations, setTranslations] = useState(enTranslations);

  // --- Currency State (Simulated) ---
  const [currency, setCurrency] = useState(localStorage.getItem('uplas-currency') || 'USD');

  // --- Initialization ---
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await api.get('auth/profile/');
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // --- Theme Effect ---
  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('uplas-theme', theme);
  }, [theme]);

  // --- Actions ---
  const login = async (email, password) => {
    const { data } = await api.post('auth/login/', { email, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Fetch profile immediately after login
    const profileRes = await api.get('auth/profile/');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const register = async (userData) => {
    // Maps frontend field names to Django expected names if necessary
    const { data } = await api.post('auth/register/', userData);
    return data;
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- Translation Helper ---
  const t = (key, fallback) => {
    return translations[key] || fallback || key;
  };

  return (
    <UplasContext.Provider value={{
      user, loading, login, logout, register,
      theme, toggleTheme,
      language, setLanguage,
      currency, setCurrency,
      t
    }}>
      {children}
    </UplasContext.Provider>
  );
};

export const useUplas = () => useContext(UplasContext);
