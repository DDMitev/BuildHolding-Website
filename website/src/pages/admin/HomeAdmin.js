import React, { useState, useEffect } from 'react';
import { Card, Nav, Tab, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as homeContentService from '../../services/homeContentService';
import * as projectService from '../../services/projectStorage';

const HomeAdmin = () => {
  const { t, i18n } = useTranslation();
  const languages = ['en', 'bg', 'ru'];
  const currentLanguage = i18n.language || 'en';
  
  const [formData, setFormData] = useState(homeContentService.getHomeContent());
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');
  
  // Load projects for featured projects selection
  useEffect(() => {
    const loadProjects = () => {
      const allProjects = projectService.getProjects();
      if (allProjects && allProjects.length > 0) {
        setProjects(allProjects);
      }
    };
    
    loadProjects();
  }, []);
  
  const handleSave = () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      const success = homeContentService.saveHomeContent(formData);
      
      if (success) {
        setSaveSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('An error occurred while saving the data.');
      }
    } catch (error) {
      console.error('Error saving home content:', error);
      setSaveError(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all Home page content to default values? This cannot be undone.')) {
      setFormData(homeContentService.default.defaultHomeContent);
    }
  };
  
  // Handle multilingual input change
  const handleMultilingualChange = (section, field, language, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [language]: value
        }
      }
    }));
  };
  
  // Render multilingual input group
  const renderMultilingualInput = (section, field, label, type = 'text') => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      {languages.map(lang => (
        <div key={lang} className="input-group mb-2">
          <span className="input-group-text" style={{backgroundColor: "#e9ecef !important", color: "#333333 !important"}}>
            {lang.toUpperCase()}
          </span>
          {type === 'textarea' ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={formData[section][field][lang] || ''}
              onChange={(e) => handleMultilingualChange(section, field, lang, e.target.value)}
              style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
            />
          ) : (
            <Form.Control
              type={type}
              value={formData[section][field][lang] || ''}
              onChange={(e) => handleMultilingualChange(section, field, lang, e.target.value)}
              style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
            />
          )}
        </div>
      ))}
    </Form.Group>
  );
  
  // Handle simple input change
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Handle service item change
  const handleServiceChange = (index, field, language, value) => {
    const updatedServices = [...formData.services.items];
    
    if (language) {
      // Update multilingual field
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: {
          ...updatedServices[index][field],
          [language]: value
        }
      };
    } else {
      // Update simple field
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };
  
  // Handle featured project selection
  const handleFeaturedProjectToggle = (projectId) => {
    const updatedFeaturedProjects = [...formData.featured.projectIds];
    
    if (updatedFeaturedProjects.includes(projectId)) {
      // Remove from featured
      const index = updatedFeaturedProjects.indexOf(projectId);
      updatedFeaturedProjects.splice(index, 1);
    } else {
      // Add to featured
      updatedFeaturedProjects.push(projectId);
    }
    
    setFormData(prev => ({
      ...prev,
      featured: {
        ...prev.featured,
        projectIds: updatedFeaturedProjects
      }
    }));
  };
  
  // Render Hero Section Editor
  const renderHeroEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-image me-2"></i> Hero Section
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('hero', 'title', 'Hero Title')}
        {renderMultilingualInput('hero', 'subtitle', 'Hero Subtitle')}
        {renderMultilingualInput('hero', 'buttonText', 'Button Text')}
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Background Image URL</Form.Label>
          <Form.Control
            type="text"
            value={formData.hero.backgroundImage || ''}
            onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
            placeholder="e.g. /images/hero-bg.jpg"
            style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
          />
          {formData.hero.backgroundImage && (
            <div className="mt-2">
              <img 
                src={formData.hero.backgroundImage} 
                alt="Hero Background Preview"
                className="img-thumbnail" 
                style={{maxHeight: '100px'}}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                }}
              />
            </div>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
  
  // Render About Section Editor
  const renderAboutEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-info-circle me-2"></i> About Section
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('about', 'title', 'Section Title')}
        {renderMultilingualInput('about', 'description1', 'First Paragraph', 'textarea')}
        {renderMultilingualInput('about', 'description2', 'Second Paragraph', 'textarea')}
        {renderMultilingualInput('about', 'buttonText', 'Button Text')}
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">About Image URL</Form.Label>
          <Form.Control
            type="text"
            value={formData.about.image || ''}
            onChange={(e) => handleInputChange('about', 'image', e.target.value)}
            placeholder="e.g. /images/about.jpg"
            style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
          />
          {formData.about.image && (
            <div className="mt-2">
              <img 
                src={formData.about.image} 
                alt="About Image Preview"
                className="img-thumbnail" 
                style={{maxHeight: '100px'}}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                }}
              />
            </div>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
  
  // Render Featured Projects Editor
  const renderFeaturedEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-star me-2"></i> Featured Projects Section
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('featured', 'title', 'Section Title')}
        {renderMultilingualInput('featured', 'subtitle', 'Section Subtitle')}
        {renderMultilingualInput('featured', 'viewDetails', 'View Details Button Text')}
        {renderMultilingualInput('featured', 'viewAll', 'View All Button Text')}
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Featured Projects</Form.Label>
          {projects.length === 0 ? (
            <Alert variant="info">
              No projects found. <Link to="/admin/projects">Create projects</Link> first to feature them on the home page.
            </Alert>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-3 mt-2">
              {projects.map(project => (
                <div key={project.id} className="col">
                  <div className={`card h-100 ${formData.featured.projectIds.includes(project.id) ? 'border-primary' : 'border'}`}>
                    <div className="card-body d-flex align-items-center p-3" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                      <Form.Check
                        type="checkbox"
                        id={`featured-${project.id}`}
                        checked={formData.featured.projectIds.includes(project.id)}
                        onChange={() => handleFeaturedProjectToggle(project.id)}
                        label={
                          <span className="ms-2 fw-bold" style={{color: "#333333 !important"}}>
                            {project.title[currentLanguage] || project.title.en || 'Untitled Project'}
                            <small className="d-block text-muted" style={{color: "#6c757d !important"}}>
                              {project.category?.[currentLanguage] || project.category?.en || 'No Category'}
                            </small>
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
  
  // Render Services Section Editor
  const renderServicesEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-cogs me-2"></i> Services Section
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('services', 'title', 'Section Title')}
        {renderMultilingualInput('services', 'subtitle', 'Section Subtitle')}
        
        <h6 className="mt-4 mb-3">Service Items</h6>
        
        {formData.services.items.map((service, index) => (
          <Card key={index} className="mb-3 border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
              <h6 className="mb-0">Service #{index + 1}</h6>
            </Card.Header>
            <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Icon (FontAwesome)</Form.Label>
                <Form.Control
                  type="text"
                  value={service.icon || ''}
                  onChange={(e) => handleServiceChange(index, 'icon', null, e.target.value)}
                  placeholder="e.g. fas fa-building"
                  style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                />
                {service.icon && (
                  <div className="mt-2">
                    <i className={`${service.icon} fa-2x text-primary`}></i>
                  </div>
                )}
              </Form.Group>
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={service.title[lang] || ''}
                    onChange={(e) => handleServiceChange(index, 'title', lang, e.target.value)}
                    style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                  />
                </div>
              ))}
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={service.description[lang] || ''}
                    onChange={(e) => handleServiceChange(index, 'description', lang, e.target.value)}
                    style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
  
  // Render Call-to-Action Section Editor
  const renderCtaEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-bullhorn me-2"></i> Call to Action Section
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('cta', 'title', 'CTA Title')}
        {renderMultilingualInput('cta', 'subtitle', 'CTA Subtitle')}
        {renderMultilingualInput('cta', 'buttonText', 'Button Text')}
      </Card.Body>
    </Card>
  );
  
  return (
    <div className="home-admin-page">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0" style={{color: "#212529 !important"}}>
            <i className="fas fa-home me-2"></i> Home Page Management
          </h1>
          <div>
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={handleReset}
              style={{backgroundColor: "#ffffff !important", color: "#6c757d !important"}}
            >
              <i className="fas fa-undo me-1"></i> Reset to Default
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={saving}
              style={{backgroundColor: "#0d6efd !important", color: "#ffffff !important"}}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1"></i> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            <i className="fas fa-check-circle me-2"></i> Home page content saved successfully!
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="danger" className="mb-4">
            <i className="fas fa-exclamation-circle me-2"></i> {saveError}
          </Alert>
        )}
        
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="card-header bg-primary" style={{backgroundColor: "#0d6efd !important", color: "#ffffff !important"}}>
                  <h5 className="mb-0">Page Sections</h5>
                </div>
                <div className="card-body p-0" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="hero" 
                        className={activeTab === "hero" ? "active" : ""}
                        style={activeTab === "hero" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-image me-2"></i> Hero Section
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="about" 
                        className={activeTab === "about" ? "active" : ""}
                        style={activeTab === "about" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-info-circle me-2"></i> About Section
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="featured" 
                        className={activeTab === "featured" ? "active" : ""}
                        style={activeTab === "featured" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-star me-2"></i> Featured Projects
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="services" 
                        className={activeTab === "services" ? "active" : ""}
                        style={activeTab === "services" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-cogs me-2"></i> Services
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="cta" 
                        className={activeTab === "cta" ? "active" : ""}
                        style={activeTab === "cta" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-bullhorn me-2"></i> Call to Action
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              
              <div className="card mt-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="card-header bg-secondary" style={{backgroundColor: "#6c757d !important", color: "#ffffff !important"}}>
                  <h5 className="mb-0">Tips</h5>
                </div>
                <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                  <p className="mb-2">
                    <i className="fas fa-info-circle me-1 text-primary"></i> All content fields support multiple languages.
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-info-circle me-1 text-primary"></i> Changes are saved to local storage and persist across sessions.
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-info-circle me-1 text-primary"></i> For icons, use <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer">FontAwesome</a> class names.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-9">
              <Tab.Content>
                <Tab.Pane eventKey="hero">
                  {renderHeroEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="about">
                  {renderAboutEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="featured">
                  {renderFeaturedEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="services">
                  {renderServicesEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="cta">
                  {renderCtaEditor()}
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
};

export default HomeAdmin;
