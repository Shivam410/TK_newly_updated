import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminGallery from './pages/admin/AdminGallery';
import AdminServices from './pages/admin/AdminServices';
import AdminTeam from './pages/admin/AdminTeam';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminBlog from './pages/admin/AdminBlog';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-primary text-xl">Loading...</div>
    </div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="grain-overlay" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/portfolio" element={<PrivateRoute><AdminPortfolio /></PrivateRoute>} />
        <Route path="/admin/gallery" element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
        <Route path="/admin/services" element={<PrivateRoute><AdminServices /></PrivateRoute>} />
        <Route path="/admin/team" element={<PrivateRoute><AdminTeam /></PrivateRoute>} />
        <Route path="/admin/inquiries" element={<PrivateRoute><AdminInquiries /></PrivateRoute>} />
        <Route path="/admin/blog" element={<PrivateRoute><AdminBlog /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
