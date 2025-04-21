import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Fallback image directly embedded
const FALLBACK_IMAGE = 'https://picsum.photos/seed/hero/1200/800';

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage = FALLBACK_IMAGE,
  buttons = [], 
  overlayOpacity = 0.5,
  height = '60vh',
  textAlignment = 'center'
}) => {
  const { t } = useTranslation();
  
  // Force the fallback image directly
  const heroStyle = {
    backgroundImage: `url(${FALLBACK_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: height,
  };
  
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
  };
  
  const textAlignmentClass = `text-${textAlignment}`;
  
  return (
    <div className="hero-section w-100 p-0 m-0">
      <div 
        className="hero-img position-relative w-100 d-flex align-items-center justify-content-center" 
        style={heroStyle}
      >
        <div 
          className="overlay" 
          style={overlayStyle}
        ></div>
        
        <div className={`hero-content container position-relative ${textAlignmentClass} text-white`}>
          {title && <h1 className="display-4 fw-bold mb-3">{title}</h1>}
          {subtitle && <p className="lead mb-4">{subtitle}</p>}
          
          {buttons.length > 0 && (
            <div className="hero-buttons">
              {buttons.map((button, index) => (
                <Link 
                  key={index}
                  to={button.path} 
                  className={`btn ${button.variant || 'btn-primary'} me-2 mb-2`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
