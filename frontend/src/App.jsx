import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore'; // FIX: Use Zustand Store
import Layout from './components/layout/Layout'; // FIX: Correct path to Layout

// Pages
import Home from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CommunityPage from './pages/CommunityPage';
import ThreadPage from './pages/ThreadPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PricingPage from './pages/PricingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';

// Placeholder for AITutorPage if it doesn't exist yet, or import it if it does
const AITutorPage = () => <div className="p-10 text-center">AI Tutor Page Coming Soon</div>;

const ProtectedRoute = ({ children }) => {
    // FIX: Read state from authStore instead of context
    const { isAuthenticated, user, isLoading } = useAuthStore();

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    
    return children;
};

const App = () => {
    // Optional: Initialize auth check on app load if strictly needed, 
    // though the store usually handles persistence automatically.
    
  return (
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Public Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Courses */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            
            {/* Learning Interface (Protected) */}
            <Route path="/courses/:courseSlug/learn/:topicId?" element={
                <ProtectedRoute>
                    <LessonPage />
                </ProtectedRoute>
            } />

            {/* Projects */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />

            {/* Community */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/thread/:slug" element={<ThreadPage />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Tools */}
            <Route path="/ai-tutor" element={<AITutorPage />} />

            {/* Dashboard (Protected) */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
};

export default App;
