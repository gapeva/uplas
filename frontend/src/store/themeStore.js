import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      currency: 'USD',
      language: 'en',

      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },

      initializeTheme: () => {
        const { theme } = get()
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const effectiveTheme = theme || (systemPrefersDark ? 'dark' : 'light')
        get().setTheme(effectiveTheme)
      },

      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),

      exchangeRates: {
        USD: 1,
        EUR: 0.92,
        KES: 130.50,
        GBP: 0.79,
        INR: 83.00,
        NGN: 1550.00,
        GHS: 15.50,
      },

      formatPrice: (priceUSD) => {
        const { currency, exchangeRates } = get()
        const rate = exchangeRates[currency] || 1
        const converted = priceUSD * rate
        
        try {
          return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(converted)
        } catch {
          return `${currency} ${converted.toFixed(2)}`
        }
      }
    }),
    {
      name: 'uplas-theme',
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        language: state.language,
      }),
    }
  )
)

export default useThemeStore
