import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Create this as a completely separate and self-contained component
  // with all styles inline to prevent any inheritance issues
  return (
    <div 
      className="footer-wrapper"
      style={{
        width: '100%',
        marginTop: '0',
        marginBottom: '0',
        padding: '0',
        display: 'block',
        position: 'relative',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: '10'
      }}
    >
      <footer 
        style={{
          backgroundColor: '#0056b3',
          color: '#ffffff',
          paddingTop: '3rem',
          paddingBottom: '0',
          marginBottom: '0',
          position: 'relative',
          width: '100%',
          display: 'block'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '1rem' }}>
                BuildHolding
              </h3>
              <p style={{ color: '#ffffff', marginBottom: '1rem' }}>
                {t('footer.description')}
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ color: '#ffffff', marginRight: '1rem', display: 'inline-block' }}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{ color: '#ffffff', marginRight: '1rem', display: 'inline-block' }}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" style={{ color: '#ffffff', display: 'inline-block' }}>
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '1rem' }}>
                {t('footer.navigation')}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/" style={{ color: '#ffffff', textDecoration: 'none' }}>
                    {t('navigation.home')}
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/our-holding" style={{ color: '#ffffff', textDecoration: 'none' }}>
                    {t('navigation.ourHolding')}
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/contact" style={{ color: '#ffffff', textDecoration: 'none' }}>
                    {t('navigation.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-4">
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '1rem' }}>
                {t('contact.location.title')}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i> 
                  {t('contact.location.address')}
                </li>
                <li style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                  <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i> 
                  {t('contact.location.phone')}
                </li>
                <li style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i> 
                  {t('contact.location.email')}
                </li>
                <li style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i> 
                  {t('contact.location.hours')}
                </li>
              </ul>
            </div>
          </div>
          
          <div 
            style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '2rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              marginBottom: '0',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#ffffff', margin: 0 }}>
              &copy; {currentYear} BuildHolding. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
