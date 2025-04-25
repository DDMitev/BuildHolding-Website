import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFirebase } from '../../firebase/FirebaseContext';
import { signOutUser } from '../../firebase/authService';

/**
 * AdminLayout component
 * Provides a consistent layout and navigation for all admin pages
 */
const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole, isAdmin, loading } = useFirebase();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check authentication - handled by the ProtectedRoute in App.js
  // Firebase context already provides user information
  
  const handleLogout = async () => {
    // Sign out using Firebase auth
    await signOutUser();
    // Redirect to login - this will happen automatically due to the ProtectedRoute
    navigate('/admin/login');
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-layout d-flex">
      {/* Sidebar */}
      <div 
        className={`sidebar bg-dark ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ 
          minHeight: '100vh', 
          width: sidebarCollapsed ? '80px' : '250px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          transition: 'width 0.3s ease',
          zIndex: 100
        }}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-between p-3 mb-3" style={{ color: '#ffffff !important' }}>
          <h5 className={`m-0 ${sidebarCollapsed ? 'd-none' : ''}`} style={{ color: '#ffffff !important' }}>BuildHolding</h5>
          <button 
            className="btn btn-link text-white border-0 p-0" 
            onClick={toggleSidebar}
            style={{ color: '#ffffff !important' }}
          >
            <i className={`fas fa-${sidebarCollapsed ? 'expand' : 'compress'}-arrows-alt`}></i>
          </button>
        </div>
        
        <ul className="nav flex-column">
          {/* Dashboard */}
          <li className="nav-item">
            <Link 
              to="/admin/dashboard" 
              className={`nav-link py-3 ${isActive('/admin/dashboard') ? 'active bg-primary' : ''}`}
              title="Dashboard"
              style={{ 
                color: isActive('/admin/dashboard') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-tachometer-alt me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Dashboard</span>
            </Link>
          </li>
          
          {/* Content Management */}
          <li className="nav-item mb-1">
            <div className={`sidebar-heading ${sidebarCollapsed ? 'd-none' : ''} px-3 mt-4 mb-1 text-muted`}>
              <span>Content Management</span>
            </div>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/home" 
              className={`nav-link py-3 ${isActive('/admin/home') ? 'active bg-primary' : ''}`}
              title="Home Page"
              style={{ 
                color: isActive('/admin/home') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-home me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Home Page</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/our-holding" 
              className={`nav-link py-3 ${isActive('/admin/our-holding') ? 'active bg-primary' : ''}`}
              title="Our Holding"
              style={{ 
                color: isActive('/admin/our-holding') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-building me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Our Holding</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/contact" 
              className={`nav-link py-3 ${isActive('/admin/contact') ? 'active bg-primary' : ''}`}
              title="Contact Page"
              style={{ 
                color: isActive('/admin/contact') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-envelope me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Contact Page</span>
            </Link>
          </li>
          
          {/* Project Management */}
          <li className="nav-item mb-1">
            <div className={`sidebar-heading ${sidebarCollapsed ? 'd-none' : ''} px-3 mt-4 mb-1 text-muted`}>
              <span>Project Management</span>
            </div>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/projects" 
              className={`nav-link py-3 ${isActive('/admin/projects') ? 'active bg-primary' : ''}`}
              title="Projects"
              style={{ 
                color: isActive('/admin/projects') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-project-diagram me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Projects</span>
            </Link>
          </li>
          
          {/* Settings */}
          <li className="nav-item mb-1">
            <div className={`sidebar-heading ${sidebarCollapsed ? 'd-none' : ''} px-3 mt-4 mb-1 text-muted`}>
              <span>Settings</span>
            </div>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/global-settings" 
              className={`nav-link py-3 ${isActive('/admin/global-settings') ? 'active bg-primary' : ''}`}
              title="Global Settings"
              style={{ 
                color: isActive('/admin/global-settings') ? '#ffffff !important' : '#adb5bd !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-cog me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Global Settings</span>
            </Link>
          </li>
          
          {/* User */}
          <li className="nav-item mt-5">
            <button 
              className="nav-link text-danger border-0 bg-transparent w-100 py-3"
              onClick={handleLogout}
              title="Logout"
              style={{ 
                color: '#dc3545 !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: sidebarCollapsed ? 'center' : 'left',
                paddingLeft: sidebarCollapsed ? '0' : '1rem'
              }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      
      {/* Main content */}
      <div 
        className="admin-content" 
        style={{ 
          marginLeft: sidebarCollapsed ? '80px' : '250px',
          width: `calc(100% - ${sidebarCollapsed ? '80px' : '250px'})`,
          transition: 'margin-left 0.3s ease, width 0.3s ease',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <header className="admin-header bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center">
          <h1 className="h5 m-0" style={{ color: '#212529 !important' }}>
            Admin Portal
          </h1>
          
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button 
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ backgroundColor: '#ffffff !important', color: '#6c757d !important' }}
              >
                <i className="fas fa-user-circle me-2"></i>
                <span>{user?.displayName || user?.email || 'Admin User'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link className="dropdown-item" to="/admin/profile">
                    <i className="fas fa-user me-2"></i> Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="admin-main p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
