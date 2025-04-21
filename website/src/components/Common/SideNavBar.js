import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

const SideNavBar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  
  // Check local storage for sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };
  
  return (
    <nav className={`sidenav ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
      </div>
      
      <div className="sidenav-content">
        <div className="logo-container mb-4">
          {collapsed ? (
            <div className="logo-small"></div>
          ) : (
            <h2>
              <span className="text-white">Build</span>
              <span className="text-secondary">Holding</span>
            </h2>
          )}
        </div>
        
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
              to="/"
              title={collapsed ? t('navigation.home') : ''}
            >
              <i className="fas fa-home me-2"></i> 
              {!collapsed && <span>{t('navigation.home')}</span>}
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`} 
              to="/projects"
              title={collapsed ? t('navigation.projects') : ''}
            >
              <i className="fas fa-building me-2"></i> 
              {!collapsed && <span>{t('navigation.projects')}</span>}
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/our-holding' ? 'active' : ''}`} 
              to="/our-holding"
              title={collapsed ? t('navigation.ourHolding') : ''}
            >
              <i className="fas fa-city me-2"></i> 
              {!collapsed && <span>{t('navigation.ourHolding')}</span>}
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
              to="/contact"
              title={collapsed ? t('navigation.contact') : ''}
            >
              <i className="fas fa-envelope me-2"></i> 
              {!collapsed && <span>{t('navigation.contact')}</span>}
            </Link>
          </li>
        </ul>
        
        <div className="language-wrapper mt-auto">
          {!collapsed ? (
            <LanguageSelector vertical={true} />
          ) : (
            <LanguageSelector collapsed={true} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default SideNavBar;
