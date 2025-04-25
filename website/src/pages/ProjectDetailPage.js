import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tab, Nav } from 'react-bootstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProjectById } from '../firebase/projectService';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const currentLang = i18n.language || 'en';
  
  // Get text in current language or fallback to English
  const getText = (textObj) => {
    if (!textObj) return '';
    return textObj[currentLang] || textObj.en || '';
  };
  
  // Format date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format number with currency symbol
  const formatCurrency = (amount, currency = 'EUR') => {
    if (!amount) return '';
    return new Intl.NumberFormat(currentLang, { 
      style: 'currency', 
      currency, 
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        
        // Fetch project from Firebase
        const projectData = await getProjectById(id);
        
        if (projectData) {
          console.log("Found project in Firebase:", projectData);
          setProject(projectData);
        } else {
          console.error("Project not found in Firebase");
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project from Firebase:", err);
        setError(err.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, currentLang]);
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: '#212529 !important', fontWeight: 'bold' }}>{t('projects.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2 style={{ color: '#212529 !important' }}>{t('projects.notFound.title')}</h2>
          <p style={{ color: '#6c757d !important' }}>{t('projects.notFound.message')}</p>
          <Link to="/projects" className="btn btn-primary mt-3">
            {t('projects.notFound.backButton')}
          </Link>
        </div>
      </div>
    );
  }
  
  // Get appropriate image URLs based on data structure
  let galleryImages = [];
  
  // If we have a gallery array of direct URLs (new format)
  if (project.gallery && Array.isArray(project.gallery)) {
    galleryImages = project.gallery.map(url => ({ 
      url: url, 
      alt: { en: project.title.en, bg: project.title.bg, ru: project.title.ru } 
    }));
  } 
  // Legacy format with images array of objects
  else if (project.images && Array.isArray(project.images)) {
    galleryImages = project.images;
  } 
  // Fallback to using the main image
  else {
    galleryImages = [{ 
      url: project.image || project.mainImageUrl, 
      alt: { en: project.title.en, bg: project.title.bg, ru: project.title.ru } 
    }];
  }
  
  // Main image - try all possible formats
  const mainImageUrl = project.image || project.images?.[0]?.url || project.mainImageUrl || '';
  
  // Slider settings for main carousel
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setActiveSlide(index),
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true
  };
  
  // Slider settings for thumbnail carousel
  const thumbnailSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  // Get project status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'complete': return 'success';
      case 'in-progress': return 'primary';
      case 'planned': return 'warning';
      default: return 'secondary';
    }
  };
  
  return (
    <div className="project-detail-page">
      {/* Project Title & Navigation */}
      <div className="bg-light py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: '#007bff' }}>{t('navigation.home')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/projects" style={{ color: '#007bff' }}>{t('navigation.projects')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page" style={{ color: '#6c757d !important' }}>
                {getText(project.title)}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container py-5">
        <div className="row">
          {/* Left column - Images & Gallery */}
          <div className="col-lg-8 mb-4">
            {/* Main image slider */}
            <div className="main-slider mb-3">
              {galleryImages.length > 0 ? (
                <Slider {...mainSliderSettings}>
                  {galleryImages.map((image, index) => (
                    <div key={`main-slide-${index}`} className="project-image-main">
                      <img 
                        src={image.url} 
                        alt={getText(image.alt) || getText(project.title)} 
                        className="img-fluid rounded shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/800x500?text=BuildHolding";
                        }}
                        style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="project-image-placeholder">
                  <img 
                    src="https://via.placeholder.com/800x500?text=BuildHolding"
                    alt={getText(project.title)}
                    className="img-fluid rounded shadow"
                    style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
            
            {/* Thumbnail slider - visible only if we have multiple images */}
            {galleryImages.length > 1 && (
              <div className="thumbnail-slider">
                <Slider 
                  {...thumbnailSliderSettings}
                  focusOnSelect={true}
                  className="slider thumbnail-track"
                >
                  {galleryImages.map((image, index) => (
                    <div 
                      key={`thumb-${index}`}
                      className={`thumbnail ${activeSlide === index ? 'active' : ''}`}
                      onClick={() => setActiveSlide(index)}
                    >
                      <img 
                        src={image.url} 
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150x100?text=Thumb";
                        }}
                        style={{ 
                          width: '100%', 
                          height: '80px', 
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: activeSlide === index ? '2px solid #007bff' : '2px solid transparent'
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
          
          {/* Right column - Project Details */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h1 className="h3 mb-4" style={{ color: '#212529 !important' }}>
                  {getText(project.title)}
                </h1>
                
                <div className="mb-4">
                  <span className={`badge bg-${getStatusClass(project.status)} mb-2`} style={{ color: 'white !important' }}>
                    {project.status === 'in-progress' 
                      ? t('projects.filters.inProgress')
                      : project.status === 'planned'
                        ? t('projects.filters.planned')
                        : t('projects.filters.complete')
                    }
                  </span>
                  
                  <div className="mt-3">
                    <p className="mb-2">
                      <strong style={{ color: '#212529 !important' }}>{t('projects.detail.category')}:</strong>{' '}
                      <span style={{ color: '#6c757d !important' }}>{getText(project.category)}</span>
                    </p>
                    
                    {project.client && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.client')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{getText(project.client)}</span>
                      </p>
                    )}
                    
                    {project.location && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.location')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{getText(project.location)}</span>
                      </p>
                    )}
                    
                    {project.dateStarted && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.startDate')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{formatDate(project.dateStarted)}</span>
                      </p>
                    )}
                    
                    {project.dateCompleted && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.completionDate')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{formatDate(project.dateCompleted)}</span>
                      </p>
                    )}
                    
                    {project.budget && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.budget')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{formatCurrency(project.budget, project.currency || 'BGN')}</span>
                      </p>
                    )}
                    
                    {project.area && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.detail.area')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{project.area} m²</span>
                      </p>
                    )}
                  </div>
                </div>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h6 mb-3" style={{ color: '#212529 !important' }}>{t('projects.detail.tags')}</h3>
                    <div>
                      {project.tags.map((tag, index) => (
                        <span 
                          key={`tag-${index}`}
                          className="badge bg-light text-dark me-2 mb-2"
                          style={{ color: '#6c757d !important', backgroundColor: '#f8f9fa !important' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-grid gap-2">
                  <Link to="/contact" className="btn btn-primary">
                    {t('projects.detail.contactUs')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different content sections */}
        <div className="mt-5">
          <Tab.Container id="project-tabs" defaultActiveKey="overview" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="mb-4 nav-tabs-custom" style={{ color: '#007bff !important', borderBottom: '1px solid #dee2e6' }}>
              <Nav.Item>
                <Nav.Link 
                  eventKey="overview" 
                  className={activeTab === 'overview' ? 'active' : ''}
                  style={{ 
                    color: activeTab === 'overview' ? '#007bff !important' : '#6c757d !important',
                    borderColor: activeTab === 'overview' ? '#dee2e6 #dee2e6 #fff' : 'transparent'
                  }}
                >
                  {t('projects.detail.tabs.overview')}
                </Nav.Link>
              </Nav.Item>
              
              {project.details && (
                <Nav.Item>
                  <Nav.Link 
                    eventKey="details"
                    className={activeTab === 'details' ? 'active' : ''}
                    style={{ 
                      color: activeTab === 'details' ? '#007bff !important' : '#6c757d !important',
                      borderColor: activeTab === 'details' ? '#dee2e6 #dee2e6 #fff' : 'transparent'
                    }}
                  >
                    {t('projects.detail.tabs.details')}
                  </Nav.Link>
                </Nav.Item>
              )}
              
              {project.features && project.features.length > 0 && (
                <Nav.Item>
                  <Nav.Link 
                    eventKey="features"
                    className={activeTab === 'features' ? 'active' : ''}
                    style={{ 
                      color: activeTab === 'features' ? '#007bff !important' : '#6c757d !important',
                      borderColor: activeTab === 'features' ? '#dee2e6 #dee2e6 #fff' : 'transparent'
                    }}
                  >
                    {t('projects.detail.tabs.features')}
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.detail.projectOverview')}</h2>
                  <div 
                    className="project-description"
                    dangerouslySetInnerHTML={{ __html: getText(project.description) }}
                  />
                </div>
              </Tab.Pane>
              
              {project.details && (
                <Tab.Pane eventKey="details">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.detail.projectDetails')}</h2>
                    <div 
                      className="project-details"
                      dangerouslySetInnerHTML={{ __html: getText(project.details) }}
                    />
                  </div>
                </Tab.Pane>
              )}
              
              {project.features && project.features.length > 0 && (
                <Tab.Pane eventKey="features">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.detail.keyFeatures')}</h2>
                    <ul className="list-group list-group-flush">
                      {project.features.map((feature, index) => (
                        <li key={`feature-${index}`} className="list-group-item border-0 px-0">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <i className="fas fa-check-circle text-success"></i>
                            </div>
                            <div>
                              {getText(feature)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
