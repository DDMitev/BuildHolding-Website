import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tab, Nav } from 'react-bootstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProjectById } from '../firebase/projectService';
import '../styles/ProjectDetail.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSlide, setActiveSlide] = useState(0);
  const mainSliderRef = useRef(null);
  
  // Get text in current language or fallback to English
  const getText = (textObj) => {
    try {
      if (!textObj) return '';
      
      // Handle string values directly
      if (typeof textObj === 'string') return textObj;
      
      // Handle numbers or other primitives
      if (typeof textObj !== 'object') return String(textObj);
      
      // Handle multilingual object
      if (textObj[currentLang]) return textObj[currentLang];
      if (textObj.en) return textObj.en;
      
      // Last resort: return the first string value found in the object
      const firstString = Object.values(textObj).find(val => typeof val === 'string');
      if (firstString) return firstString;
      
      // If nothing works, return empty string
      return '';
    } catch (err) {
      console.warn('Error extracting text:', err);
      return '';
    }
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
  
  // Breadcrumb and navigation helper (must be at top level before any returns)
  const safeProjectTitle = useMemo(() => {
    if (!project) return '';
    
    // Use the safe title from our sanitized project data
    if (project.title_safe) return project.title_safe;
    
    try {
      return getText(project.title);
    } catch (error) {
      console.error("Error getting project title:", error);
      return "Project";
    }
  }, [project]);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        
        // Fetch project from Firebase
        const projectData = await getProjectById(id);
        
        if (projectData) {
          console.log("Found project in Firebase:", projectData);
          // Make sure all fields that should be objects are objects to prevent rendering errors
          const safeProject = {
            ...projectData,
            // Ensure these fields are objects with language properties
            title: typeof projectData.title === 'object' ? projectData.title : { en: String(projectData.title || '') },
            description: typeof projectData.description === 'object' ? projectData.description : { en: String(projectData.description || '') },
            // Add other critical fields that might cause rendering issues
            category: typeof projectData.category === 'object' ? projectData.category : { en: String(projectData.category || '') }
          };
          setProject(safeProject);
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
  
  try {
    // If we have a gallery array (preferred format)
    if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
      galleryImages = project.gallery.map(url => ({ 
        url: typeof url === 'string' ? url : '',
        alt: project.title?.en || "Project Image" 
      }));
    } 
    // Legacy format with images array of objects
    else if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      galleryImages = project.images.map(img => ({
        url: typeof img === 'object' && img.url ? img.url : (typeof img === 'string' ? img : ''),
        alt: typeof img === 'object' && img.alt ? 
          (typeof img.alt === 'object' ? (img.alt.en || "Project Image") : String(img.alt || "Project Image")) 
          : "Project Image"
      }));
    } 
    // Fallback to using a placeholder
    else {
      galleryImages = [{ 
        url: "https://via.placeholder.com/800x500?text=No+Image+Available", 
        alt: project.title?.en || "Project Image" 
      }];
    }
  } catch (error) {
    console.error("Error processing gallery images:", error);
    galleryImages = [{
      url: "https://via.placeholder.com/800x500?text=Error+Loading+Image",
      alt: "Project Image"
    }];
  }
  
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
                {safeProjectTitle}
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
                <Slider {...mainSliderSettings} ref={mainSliderRef}>
                  {galleryImages.map((image, index) => (
                    <div key={`main-slide-${index}`} className="project-image-main">
                      <img 
                        src={image.url} 
                        alt={image.alt} 
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
                    alt={safeProjectTitle}
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
                      onClick={() => {
                        setActiveSlide(index);
                        // Go to selected slide in main slider
                        if (mainSliderRef.current) {
                          mainSliderRef.current.slickGoTo(index);
                        }
                      }}
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
                  {safeProjectTitle}
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
                      <strong style={{ color: '#212529 !important' }}>{t('projectDetail.category')}:</strong>{' '}
                      <span style={{ color: '#6c757d !important' }}>
                        {project.category_safe || getText(project.category)}
                      </span>
                    </p>
                    
                    {(project.client || project.client_safe) && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projectDetail.client', 'Client')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>
                          {project.client_safe || getText(project.client)}
                        </span>
                      </p>
                    )}
                    
                    {(project.location || project.location_safe) && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projectDetail.location')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>
                          {project.location_safe ? 
                            `${project.location_safe.city || ''} ${project.location_safe.address || ''} ${project.location_safe.country || ''}`.trim() :
                            (project.location.address ? 
                              getText(project.location.address) : 
                              (project.location.city ? 
                                `${getText(project.location.city)}, ${getText(project.location.country || '')}` : 
                                getText(project.location)))}
                        </span>
                      </p>
                    )}
                    
                    {project.dateStarted && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.startDate', 'Start Date')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{formatDate(project.dateStarted)}</span>
                      </p>
                    )}
                    
                    {project.dateCompleted && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.completionDate', 'Completion Date')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>{formatDate(project.dateCompleted)}</span>
                      </p>
                    )}
                    
                    {project.budget && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.budget', 'Budget')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>
                          {typeof project.budget === 'object' && project.budget.total ? 
                            formatCurrency(project.budget.total, project.budget.currency || 'EUR') : 
                            formatCurrency(project.budget, project.currency || 'BGN')}
                        </span>
                      </p>
                    )}
                    
                    {project.area && (
                      <p className="mb-2">
                        <strong style={{ color: '#212529 !important' }}>{t('projects.projectSize', 'Project Size')}:</strong>{' '}
                        <span style={{ color: '#6c757d !important' }}>
                          {typeof project.area === 'object' && project.area.value ? 
                            `${project.area.value} ${project.area.unit || 'm²'}` : 
                            `${project.area} m²`}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h6 mb-3" style={{ color: '#212529 !important' }}>{t('projects.keyFeatures', 'Features')}</h3>
                    <div>
                      {project.tags.map((tag, index) => (
                        <span 
                          key={`tag-${index}`}
                          className="badge bg-light text-dark me-2 mb-2"
                          style={{ color: '#6c757d !important', backgroundColor: '#f8f9fa !important' }}
                        >
                          {getText(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-grid gap-2">
                  <Link to="/contact" className="btn btn-primary">
                    {t('projects.contactUs', 'Contact Us')}
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
                  {t('projects.tabs.overview')}
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  eventKey="details"
                  className={activeTab === 'details' ? 'active' : ''}
                  style={{ 
                    color: activeTab === 'details' ? '#007bff !important' : '#6c757d !important',
                    borderColor: activeTab === 'details' ? '#dee2e6 #dee2e6 #fff' : 'transparent'
                  }}
                >
                  {t('projects.details', 'Details')}
                </Nav.Link>
              </Nav.Item>
              
              {project.timeline && project.timeline.length > 0 && (
                <Nav.Item>
                  <Nav.Link 
                    eventKey="timeline"
                    className={activeTab === 'timeline' ? 'active' : ''}
                    style={{ 
                      color: activeTab === 'timeline' ? '#007bff !important' : '#6c757d !important',
                      borderColor: activeTab === 'timeline' ? '#dee2e6 #dee2e6 #fff' : 'transparent'
                    }}
                  >
                    {t('projects.tabs.timeline')}
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
                    {t('projects.tabs.features')}
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.projectDescription', 'Project Description')}</h2>
                  <div 
                    className="project-description"
                    dangerouslySetInnerHTML={{ __html: project.description_safe || getText(project.description) }}
                  />
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="details">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.projectDetails', 'Project Details')}</h2>
                  
                  {/* Display structured details if available */}
                  <div className="row">
                    {project.specifications && (
                      <div className="col-md-6 mb-4">
                        <h5 className="mb-3">{t('projects.specifications', 'Specifications')}</h5>
                        <ul className="list-group list-group-flush">
                          {project.specifications.size && (
                            <li className="list-group-item border-0 px-0">
                              <strong>{t('projects.projectSize', 'Size')}:</strong> {project.specifications.size.value} {project.specifications.size.unit}
                            </li>
                          )}
                          {project.specifications.capacity && (
                            <li className="list-group-item border-0 px-0">
                              <strong>{t('projects.capacity', 'Capacity')}:</strong> {project.specifications.capacity.value} {project.specifications.capacity.unit}
                            </li>
                          )}
                          {project.specifications.sustainability && project.specifications.sustainability.features && (
                            <li className="list-group-item border-0 px-0">
                              <strong>{t('projects.sustainabilityFeatures', 'Sustainability')}:</strong><br />
                              <ul className="mt-2">
                                {project.specifications.sustainability.features.map((feature, idx) => (
                                  <li key={idx}>{typeof feature === 'object' ? getText(feature) : feature}</li>
                                ))}
                              </ul>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {project.financial && (
                      <div className="col-md-6 mb-4">
                        <h5 className="mb-3">{t('projects.financial')}</h5>
                        <ul className="list-group list-group-flush">
                          {project.financial.budget && (
                            <li className="list-group-item border-0 px-0">
                              <strong>{t('projects.budget', 'Budget')}:</strong> {formatCurrency(project.financial.budget.total, project.financial.budget.currency || 'EUR')}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* If there's a details string or object, display it too */}
                  {(project.details_safe || project.details) && (
                    <div 
                      className="project-details mt-3"
                      dangerouslySetInnerHTML={{ __html: project.details_safe || getText(project.details) }}
                    />
                  )}
                </div>
              </Tab.Pane>
              
              {(project.timeline_safe || (project.timeline && project.timeline.length > 0)) && (
                <Tab.Pane eventKey="timeline">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.projectTimeline', 'Project Timeline')}</h2>
                    <div className="timeline-wrapper">
                      {(project.timeline_safe || project.timeline).map((item, index) => (
                        <div key={`timeline-${index}`} className="timeline-item">
                          <div className="timeline-badge bg-primary">
                            <i className={item.icon || "fas fa-calendar"}></i>
                          </div>
                          <div className="timeline-panel">
                            <div className="timeline-heading">
                              <h4 className="timeline-title">{project.timeline_safe ? item.title : getText(item.title)}</h4>
                              <p><small className="text-muted"><i className="fas fa-clock"></i> {formatDate(item.date)}</small></p>
                            </div>
                            <div className="timeline-body">
                              <p>{project.timeline_safe ? item.description : getText(item.description)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Pane>
              )}
              
              {(project.features_safe || (project.features && project.features.length > 0)) && (
                <Tab.Pane eventKey="features">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <h2 className="h4 mb-4" style={{ color: '#212529 !important' }}>{t('projects.keyFeatures', 'Key Features')}</h2>
                    
                    <div className="row">
                      {(project.features_safe || project.features).map((feature, index) => {
                        // Handle both string features and object features
                        const isObjectFeature = typeof feature === 'object' && feature !== null;
                        const featureText = isObjectFeature ? 
                          (project.features_safe ? feature : getText(feature)) : 
                          String(feature);
                          
                        return (
                          <div key={`feature-${index}`} className="col-md-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                              <div className="card-body">
                                {isObjectFeature && feature.title ? (
                                  <>
                                    <h5 className="card-title mb-3">
                                      {project.features_safe ? feature.title : getText(feature.title)}
                                    </h5>
                                    <p className="card-text">
                                      {project.features_safe ? feature.description : getText(feature.description)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="card-text">{featureText}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
