import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import SideNavBar from './components/Common/SideNavBar';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import OurHoldingPage from './pages/OurHoldingPage';
import ContactPage from './pages/ContactPage';
import ProjectAdmin from './pages/ProjectAdmin';
import Preloader from './components/Common/Preloader';
import Footer from './components/Common/Footer';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import LoginPage from './pages/admin/LoginPage';
import HomeAdmin from './pages/admin/HomeAdmin';
import OurHoldingAdmin from './pages/admin/OurHoldingAdmin';
import ContactAdmin from './pages/admin/ContactAdmin';

// Admin layout
import AdminLayout from './components/Admin/AdminLayout';

// Enhanced RouteChangeHandler with force remount
const RouteChangeHandler = ({ children }) => {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);
  
  // Update key on location change to force remount
  useEffect(() => {
    setKey(location.pathname);
    // Force scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return React.cloneElement(children, { key });
};

function App() {
  const [loading, setLoading] = useState(true);

  // Handle SPA redirect paths from direct URL access
  useEffect(() => {
    // Check if we have a redirect path stored (from our index.html script)
    const redirectPath = sessionStorage.getItem('spa_redirect_path');
    if (redirectPath) {
      // Clear it so we don't redirect again
      sessionStorage.removeItem('spa_redirect_path');
      // Only redirect if we're not already on that path
      if (window.location.pathname !== redirectPath) {
        window.history.replaceState(null, null, redirectPath);
      }
    }
  }, []);

  // Initialize AOS - re-enable animations but keep them subtle
  useEffect(() => {
    AOS.init({
      duration: 300, // Short duration
      easing: 'ease',
      once: true,
      mirror: false,
      disable: false // Re-enable AOS
    });
    
    // Hide preloader after content load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Reduced time
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {loading && <Preloader />}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="our-holding" element={<OurHoldingAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="projects" element={<ProjectAdmin />} />
            <Route index element={<DashboardPage />} />
          </Route>
          
          {/* Legacy Admin Route - Redirect for backward compatibility */}
          <Route path="/admin/projects" element={<AdminLayout />}>
            <Route index element={<ProjectAdmin />} />
          </Route>
          
          {/* Public Routes - With SideNavBar and Footer */}
          <Route path="*" element={
            <>
              <SideNavBar />
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<RouteChangeHandler><HomePage /></RouteChangeHandler>} />
                  <Route path="/projects" element={<RouteChangeHandler><ProjectsPage /></RouteChangeHandler>} />
                  <Route path="/projects/:id" element={<RouteChangeHandler><ProjectDetailPage /></RouteChangeHandler>} />
                  <Route path="/our-holding" element={<RouteChangeHandler><OurHoldingPage /></RouteChangeHandler>} />
                  <Route path="/contact" element={<RouteChangeHandler><ContactPage /></RouteChangeHandler>} />
                  <Route path="*" element={<RouteChangeHandler><HomePage /></RouteChangeHandler>} />
                </Routes>
                <Footer />
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
