import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import PricingPage from './pages/PricingPage'
import BlogPage from './pages/BlogPage'
import CommunityPage from './pages/CommunityPage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import AITutorPage from './pages/AITutorPage'

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeTheme()
    initializeAuth()
  }, [initializeTheme, initializeAuth])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #333)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="ai-tutor" element={<ProtectedRoute><AITutorPage /></ProtectedRoute>} />
          <Route path="community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
