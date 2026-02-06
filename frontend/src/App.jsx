import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UplasProvider, useUplas } from './contexts/UplasContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
// Placeholder pages for routes that haven't been built yet
const Placeholder = ({title}) => <div className="container" style={{padding: '50px'}}><h1>{title}</h1><p>Coming Soon</p></div>;

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUplas();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/#auth-section" replace />;
    return children;
};

const App = () => {
  return (
    <UplasProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            
            {/* Public Routes */}
            <Route path="/courses" element={<Placeholder title="Courses" />} />
            <Route path="/pricing" element={<Placeholder title="Pricing" />} />
            <Route path="/about" element={<Placeholder title="About Us" />} />
            <Route path="/blog" element={<Placeholder title="Blog" />} />
            <Route path="/community" element={<Placeholder title="Community" />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UplasProvider>
  );
};

export default App;
