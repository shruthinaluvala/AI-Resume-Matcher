import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import MyResumes from './pages/MyResumes';
import ResumeTips from './pages/ResumeTips';
import Analyze from './pages/Analyze';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ContactUs from './pages/ContactUs';

// Protected Route Wrapper
const ProtectedRoute = ({ children, authToken }) => {
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [authToken, setAuthToken] = useState(null);

  // Check storage on mount
  useEffect(() => {
    const token = localStorage.getItem('skillmatch_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skillmatch_token');
    localStorage.removeItem('skillmatch_user');
    setAuthToken(null);
  };

  return (
    <BrowserRouter>
      {/* Pass auth state to Navbar to toggle Sign In / Out */}
      <Navbar isAuthenticated={!!authToken} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/signup" element={<Signup setAuthToken={setAuthToken} />} />
        
        <Route path="/tips" element={<ResumeTips />} />
        <Route path="/contact" element={<ContactUs />} />
        
        {/* Protected Routes */}
        <Route 
          path="/my-resumes" 
          element={
            <ProtectedRoute authToken={authToken}>
              <MyResumes />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analyze" 
          element={
            <ProtectedRoute authToken={authToken}>
              <Analyze />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
