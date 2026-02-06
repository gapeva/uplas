import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import enTranslations from '../../frontend/locales/en.json'; // Adjust path as needed

const UplasContext = createContext();

export const UplasProvider = ({ children }) => {
  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('uplasGlobalTheme') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // --- Language State ---
  const [language, setLanguage] = useState(() => localStorage.getItem('uplasPreferredLanguage') || 'en');
  const [translations, setTranslations] = useState(enTranslations);

  // --- Currency State ---
  const [currency, setCurrency] = useState(() => localStorage.getItem('uplasUserCurrency') || 'USD');
  const exchangeRates = { USD: 1, EUR: 0.92, KES: 130.50, GBP: 0.79, INR: 83.00, JPY: 157.00 };

  // --- Auth State ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Effects ---
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('uplasGlobalTheme', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // In a real app, fetch dynamic JSON here based on `language`
    // For now, we use the embedded EN translations
    localStorage.setItem('uplasPreferredLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('uplasUserCurrency', currency);
  }, [currency]);

  // --- Methods ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const t = (key, fallback) => {
    return translations[key] || fallback || key;
  };

  const formatPrice = (amountInUSD) => {
    const rate = exchangeRates[currency] || 1;
    const value = amountInUSD * rate;
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
      }).format(value);
    } catch (e) {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const login = async (email, password) => {
    // Simulated Login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@')) {
          const mockUser = { id: 1, email, full_name: 'Test User' };
          setUser(mockUser);
          localStorage.setItem('accessToken', 'mock_jwt_token');
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <UplasContext.Provider value={{
      isDarkMode, toggleTheme,
      language, setLanguage,
      currency, setCurrency,
      user, login, logout,
      t, formatPrice
    }}>
      {children}
    </UplasContext.Provider>
  );
};

export const useUplas = () => useContext(UplasContext);
