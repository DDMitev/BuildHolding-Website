import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tab, Nav } from 'react-bootstrap';
import hardcodedProjects from '../data/hardcoded-projects';
import { projectService } from '../services/api.service';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import projectStorage from '../services/projectStorage';

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
        
        // First check localStorage for the most up-to-date version
        const projectFromStorage = projectStorage.getProjectById(id);
        
        if (projectFromStorage) {
          console.log("Found project in localStorage:", projectFromStorage);
          setProject(projectFromStorage);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try to fetch from API
        try {
          const response = await projectService.getById(id);
          
          if (response.data && response.data.data) {
            console.log("API Project Detail:", response.data.data);
            setProject(response.data.data);
          } else {
            // Fallback to hardcoded projects if API returns empty data
            console.log("Falling back to hardcoded project data");
            const projectData = hardcodedProjects.find(p => p.id === id || p._id === id);
            setProject(projectData);
          }
        } catch (err) {
          console.error("Error fetching project details from API:", err);
          
          // Fallback to hardcoded projects on error
          const projectData = hardcodedProjects.find(p => p.id === id || p._id === id);
          setProject(projectData);
        }
      } catch (err) {
        console.error("Error in project fetching process:", err);
        setError(err);
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
          <div className="page-loader">
            <div className="logo-pulse-container">
              <div className="logo-pulse">BH</div>
            </div>
            <p className="mt-3" style={{ color: '#212529 !important', fontWeight: 'bold' }}>{t('projects.loading')}</p>
          </div>
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
      <div className="bg-light border-bottom py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-0" data-aos="fade-up">
                {getText(project.title)}
              </h1>
              <div className="d-flex align-items-center mt-2">
                <span className={`badge bg-${getStatusClass(project.status)} me-2`}>
                  {t(`projects.status.${project.status}`)}
                </span>
                <span className="text-muted">
                  {getText(project.category)} - {getText(project.subcategory || project.category)}
                </span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link to="/projects" className="btn btn-outline-primary">
                <i className="fas fa-arrow-left me-2"></i>
                {t('projects.backToProjects')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column - Gallery and Description */}
          <div className="col-lg-8" data-aos="fade-right">
            {/* Image Carousel */}
            <div className="project-gallery mb-4">
              <div className="main-slider-wrapper mb-3">
                <Slider {...mainSliderSettings} className="main-slider">
                  {galleryImages.map((image, idx) => (
                    <div key={idx} className="main-slide">
                      <img 
                        src={image.url} 
                        alt={getText(image.alt)} 
                        className="img-fluid rounded shadow-sm"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              
              {galleryImages.length > 1 && (
                <div className="thumbnail-slider-wrapper">
                  <Slider 
                    {...thumbnailSliderSettings} 
                    className="thumbnail-slider"
                    asNavFor={null}
                  >
                    {galleryImages.map((image, idx) => (
                      <div key={idx} className="px-1">
                        <div 
                          className={`thumbnail-slide ${idx === activeSlide ? 'active' : ''}`}
                          onClick={() => setActiveSlide(idx)}
                        >
                          <img 
                            src={image.url} 
                            alt={getText(image.alt)} 
                            className="img-fluid rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
            
            {/* Tabs Navigation */}
            <div className="project-content-tabs">
              <Tab.Container id="project-tabs" defaultActiveKey="overview" onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">{t('projects.tabs.overview')}</Nav.Link>
                  </Nav.Item>
                  {project.features && (
                    <Nav.Item>
                      <Nav.Link eventKey="features">{t('projects.tabs.features')}</Nav.Link>
                    </Nav.Item>
                  )}
                  {project.timeline && (
                    <Nav.Item>
                      <Nav.Link eventKey="timeline">{t('projects.tabs.timeline')}</Nav.Link>
                    </Nav.Item>
                  )}
                  {project.team && (
                    <Nav.Item>
                      <Nav.Link eventKey="team">{t('projects.tabs.team')}</Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
                
                <Tab.Content>
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <div className="project-description mb-4">
                      <h2 className="h4 mb-3">{t('projects.projectDescription')}</h2>
                      <p className="lead">{getText(project.description)}</p>
                      
                      {project.client && (
                        <div className="client-info mt-4 p-4 bg-light rounded">
                          <div className="d-flex align-items-center mb-3">
                            {project.client.logo && (
                              <img 
                                src={project.client.logo} 
                                alt={getText(project.client.name)} 
                                className="me-3" 
                                style={{ maxWidth: '80px', maxHeight: '40px' }}
                              />
                            )}
                            <h3 className="h5 mb-0">{getText(project.client.name)}</h3>
                          </div>
                          {project.client.testimonial && (
                            <blockquote className="blockquote mb-0">
                              <p className="fst-italic">"{getText(project.client.testimonial)}"</p>
                            </blockquote>
                          )}
                        </div>
                      )}
                    </div>
                  </Tab.Pane>
                  
                  {/* Features Tab */}
                  <Tab.Pane eventKey="features">
                    <h2 className="h4 mb-4">{t('projects.keyFeatures')}</h2>
                    {project.features && (
                      <div className="row g-4">
                        {project.features.map((feature, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="feature-item d-flex align-items-start">
                              <div className="feature-icon me-3">
                                <i className="fas fa-check-circle text-success"></i>
                              </div>
                              <div className="feature-text">
                                {getText(feature)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {project.specifications?.sustainability?.features && (
                      <div className="sustainability-features mt-5">
                        <h3 className="h5 mb-3">
                          <i className="fas fa-leaf text-success me-2"></i>
                          {t('projects.sustainabilityFeatures')}
                        </h3>
                        <div className="row g-3">
                          {project.specifications.sustainability.features.map((feature, idx) => (
                            <div key={idx} className="col-md-6">
                              <div className="d-flex align-items-start">
                                <i className="fas fa-leaf text-success me-2 mt-1"></i>
                                <span>{getText(feature)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Tab.Pane>
                  
                  {/* Timeline Tab */}
                  <Tab.Pane eventKey="timeline">
                    <h2 className="h4 mb-4">{t('projects.projectTimeline')}</h2>
                    {project.timeline && (
                      <div className="project-timeline">
                        <div className="timeline-wrapper">
                          <ul className="timeline">
                            {Object.entries(project.timeline).map(([phase, data], idx) => {
                              // Skip the completion phase as it's shown separately
                              if (phase === 'completion') return null;
                              
                              const phaseTitle = t(`projects.timeline.${phase}`);
                              let statusClass = 'secondary';
                              
                              if (data.completed) {
                                statusClass = 'success';
                              } else if (data.inProgress) {
                                statusClass = 'primary';
                              }
                              
                              return (
                                <li key={idx} className={`timeline-item ${data.completed ? 'completed' : data.inProgress ? 'in-progress' : 'pending'}`}>
                                  <div className={`timeline-badge bg-${statusClass}`}>
                                    <i className={`fas ${data.completed ? 'fa-check' : data.inProgress ? 'fa-spinner fa-spin' : 'fa-hourglass'}`}></i>
                                  </div>
                                  <div className="timeline-panel">
                                    <div className="timeline-heading">
                                      <h4 className="timeline-title">{phaseTitle}</h4>
                                      <p className="text-muted">
                                        <small>
                                          {formatDate(data.start)} - {formatDate(data.end)}
                                        </small>
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                            
                            {project.timeline.completion && (
                              <li className="timeline-item pending">
                                <div className="timeline-badge bg-info">
                                  <i className="fas fa-flag-checkered"></i>
                                </div>
                                <div className="timeline-panel">
                                  <div className="timeline-heading">
                                    <h4 className="timeline-title">{t('projects.timeline.completion')}</h4>
                                    <p className="text-muted">
                                      <small>
                                        {t('projects.projectedCompletion')}: {formatDate(project.timeline.completion.projected)}
                                      </small>
                                    </p>
                                  </div>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        {/* Progress Bar */}
                        {project.completionPercentage && (
                          <div className="progress-wrapper mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>{t('projects.completionProgress')}</span>
                              <span className="fw-bold">{project.completionPercentage}%</span>
                            </div>
                            <div className="progress">
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{width: `${project.completionPercentage}%`}} 
                                aria-valuenow={project.completionPercentage} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Tab.Pane>
                  
                  {/* Team Tab */}
                  <Tab.Pane eventKey="team">
                    <h2 className="h4 mb-4">{t('projects.projectTeam')}</h2>
                    {project.team && (
                      <div className="row g-4">
                        {Object.entries(project.team).map(([role, name], idx) => (
                          <div key={idx} className="col-md-6 col-lg-4">
                            <div className="team-member-card card h-100">
                              <div className="card-body">
                                <h5 className="card-title">{t(`projects.team.${role}`)}</h5>
                                <p className="card-text">{getText(name)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
          
          {/* Right Column - Project Details */}
          <div className="col-lg-4" data-aos="fade-left">
            <div className="project-sidebar sticky-lg-top" style={{ top: '2rem' }}>
              {/* Project Specifications */}
              <div className="card mb-4 project-specs">
                <div className="card-header bg-primary text-white">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    {t('projects.projectDetails')}
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {/* Project Size/Scope */}
                    {project.specifications?.size && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-ruler text-primary me-2"></i>
                          {t('projects.projectSize')}
                        </span>
                        <span className="fw-bold">
                          {typeof project.specifications.size === 'object' ? 
                            `${project.specifications.size.value.toLocaleString()} ${project.specifications.size.unit}` :
                            project.specifications.size.toLocaleString()}
                        </span>
                      </li>
                    )}
                    
                    {/* Project Capacity (for energy, water, etc. projects) */}
                    {project.specifications?.capacity && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-tachometer-alt text-primary me-2"></i>
                          {t('projects.capacity')}
                        </span>
                        <span className="fw-bold">
                          {typeof project.specifications.capacity === 'object' ? 
                            `${project.specifications.capacity.value.toLocaleString()} ${project.specifications.capacity.unit}` :
                            project.specifications.capacity.toLocaleString()}
                        </span>
                      </li>
                    )}
                    
                    {/* Project Duration */}
                    {project.duration && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-calendar-alt text-primary me-2"></i>
                          {t('projects.duration')}
                        </span>
                        <span className="fw-bold">
                          {typeof project.duration === 'object' ? 
                            `${project.duration.value} ${project.duration.unit}` :
                            project.duration}
                        </span>
                      </li>
                    )}
                    
                    {/* Project Location */}
                    {project.location && project.location.address && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-map-marker-alt text-primary me-2"></i>
                          {t('projects.location')}
                        </span>
                        <span className="fw-bold text-end" style={{maxWidth: '60%'}}>
                          {getText(project.location.address)}
                        </span>
                      </li>
                    )}
                    
                    {/* Budget */}
                    {project.financial?.budget && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-money-bill-wave text-primary me-2"></i>
                          {t('projects.budget')}
                        </span>
                        <span className="fw-bold">
                          {formatCurrency(project.financial.budget.total, project.financial.budget.currency)}
                        </span>
                      </li>
                    )}
                    
                    {/* Status */}
                    {project.status && (
                      <li className="list-group-item d-flex justify-content-between align-items-center border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                        <span>
                          <i className="fas fa-tasks text-primary me-2"></i>
                          {t('projects.status.label')}
                        </span>
                        <span className={`badge bg-${getStatusClass(project.status)} text-white`}>
                          {t(`projects.status.${project.status}`)}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Project Location */}
              {project.location && (
                <div className="card mb-4 project-location">
                  <div className="card-header bg-primary text-white">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {t('projects.location')}
                    </h3>
                  </div>
                  <div className="card-body p-0">
                    <div className="ratio ratio-4x3">
                      <iframe 
                        title="Project Location"
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${project.location.coordinates.lng}!3d${project.location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1619749773865!5m2!1sen!2sbg`}
                        style={{border:0}}
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </div>
                    {project.location.address && (
                      <div className="p-3">
                        <i className="fas fa-map-pin text-danger me-2"></i>
                        {getText(project.location.address)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Call to Action */}
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h4 className="card-title h5">{t('projects.interestedProject')}</h4>
                  <p className="card-text">{t('projects.contactUsForMore')}</p>
                  <Link to="/contact" className="btn btn-primary">
                    <i className="fas fa-envelope me-2"></i>
                    {t('projects.contactUs')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Projects Section - Would be added in future iterations */}
      
    </div>
  );
};

export default ProjectDetailPage;
