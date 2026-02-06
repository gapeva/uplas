import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UplasProvider, useUplas } from './contexts/UplasContext';
import Home from './pages/Home';

// Placeholder for Dashboard
const Dashboard = () => {
    const { logout, user } = useUplas();
    return (
        <div style={{padding: '100px', textAlign: 'center'}}>
            <h1>Welcome, {user?.full_name}</h1>
            <button onClick={logout} className="button button--secondary">Logout</button>
        </div>
    );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUplas();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    return children;
};

const App = () => {
  return (
    <UplasProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Add other routes (Pricing, Courses) here */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UplasProvider>
  );
};

export default App;
