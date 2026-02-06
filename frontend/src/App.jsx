import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UplasProvider, useUplas } from './contexts/UplasContext';
import Layout from './components/Layout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthPage from './pages/AuthPage'; // Added

// Pages
import Home from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CommunityPage from './pages/CommunityPage';
import ThreadPage from './pages/ThreadPage'; // New
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage'; // New
import PricingPage from './pages/PricingPage'; // New
import AITutorPage from './pages/AITutorPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage'; // And Terms, Privacy...

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUplas();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const App = () => {
  return (
    <UplasProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Courses */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/courses/:courseSlug/learn/:topicId" element={
                <ProtectedRoute><LessonPage /></ProtectedRoute>
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

            {/* Pricing */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/ai-tutor" element={<AITutorPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            } />
              
            {/* Specific Route for Learning Interface (No Layout/Header/Footer usually) */}
            <Route path="/courses/:courseSlug/learn/:topicId?" element={
                <ProtectedRoute>
                    <LessonPage />
                </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UplasProvider>
  );
};

export default App;
