import React, { useState, useEffect } from 'react';
import { Card, Nav, Tab, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as contactContentService from '../../services/contactContentService';

const ContactAdmin = () => {
  const { t, i18n } = useTranslation();
  const languages = ['en', 'bg', 'ru'];
  const currentLanguage = i18n.language || 'en';
  
  const [formData, setFormData] = useState(contactContentService.getContactContent());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');
  
  const handleSave = () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      const success = contactContentService.saveContactContent(formData);
      
      if (success) {
        setSaveSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('An error occurred while saving the data.');
      }
    } catch (error) {
      console.error('Error saving contact content:', error);
      setSaveError(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all Contact page content to default values? This cannot be undone.')) {
      setFormData(contactContentService.default.defaultContactContent);
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
  
  // Handle nested multilingual input change
  const handleNestedMultilingualChange = (section, nestedSection, field, language, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...prev[section][nestedSection],
          [field]: {
            ...prev[section][nestedSection][field],
            [language]: value
          }
        }
      }
    }));
  };
  
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
  
  // Handle nested simple input change
  const handleNestedInputChange = (section, nestedSection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...prev[section][nestedSection],
          [field]: value
        }
      }
    }));
  };
  
  // Handle map coordinates change
  const handleCoordinateChange = (field, value) => {
    const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      map: {
        ...prev.map,
        coordinates: {
          ...prev.map.coordinates,
          [field]: numValue
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
  
  // Render nested multilingual input
  const renderNestedMultilingualInput = (section, nestedSection, field, label, type = 'text') => (
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
              value={formData[section][nestedSection][field][lang] || ''}
              onChange={(e) => handleNestedMultilingualChange(section, nestedSection, field, lang, e.target.value)}
              style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
            />
          ) : (
            <Form.Control
              type={type}
              value={formData[section][nestedSection][field][lang] || ''}
              onChange={(e) => handleNestedMultilingualChange(section, nestedSection, field, lang, e.target.value)}
              style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
            />
          )}
        </div>
      ))}
    </Form.Group>
  );
  
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
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Background Image URL</Form.Label>
          <Form.Control
            type="text"
            value={formData.hero.backgroundImage || ''}
            onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
            placeholder="e.g. /images/hero-contact.jpg"
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
  
  // Render Contact Information Editor
  const renderContactInfoEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-address-card me-2"></i> Contact Information
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('contactInfo', 'title', 'Section Title')}
        {renderMultilingualInput('contactInfo', 'description', 'Section Description', 'textarea')}
        
        <h6 className="mt-4 mb-3">Main Office</h6>
        <Card className="mb-4" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
          <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            {renderNestedMultilingualInput('contactInfo', 'mainOffice', 'title', 'Office Title')}
            {renderNestedMultilingualInput('contactInfo', 'mainOffice', 'address', 'Office Address')}
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={formData.contactInfo.mainOffice.phone || ''}
                onChange={(e) => handleNestedInputChange('contactInfo', 'mainOffice', 'phone', e.target.value)}
                placeholder="e.g. +359 2 123 4567"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email Address</Form.Label>
              <Form.Control
                type="email"
                value={formData.contactInfo.mainOffice.email || ''}
                onChange={(e) => handleNestedInputChange('contactInfo', 'mainOffice', 'email', e.target.value)}
                placeholder="e.g. info@buildholding.com"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
            
            {renderNestedMultilingualInput('contactInfo', 'mainOffice', 'hours', 'Office Hours')}
          </Card.Body>
        </Card>
        
        <h6 className="mt-4 mb-3">Social Media</h6>
        <Card className="mb-4" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
          <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Facebook URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.contactInfo.socialMedia.facebook || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    ...prev.contactInfo,
                    socialMedia: {
                      ...prev.contactInfo.socialMedia,
                      facebook: e.target.value
                    }
                  }
                }))}
                placeholder="e.g. https://facebook.com/buildholding"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">LinkedIn URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.contactInfo.socialMedia.linkedin || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    ...prev.contactInfo,
                    socialMedia: {
                      ...prev.contactInfo.socialMedia,
                      linkedin: e.target.value
                    }
                  }
                }))}
                placeholder="e.g. https://linkedin.com/company/buildholding"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Instagram URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.contactInfo.socialMedia.instagram || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    ...prev.contactInfo,
                    socialMedia: {
                      ...prev.contactInfo.socialMedia,
                      instagram: e.target.value
                    }
                  }
                }))}
                placeholder="e.g. https://instagram.com/buildholding"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Twitter URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.contactInfo.socialMedia.twitter || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    ...prev.contactInfo,
                    socialMedia: {
                      ...prev.contactInfo.socialMedia,
                      twitter: e.target.value
                    }
                  }
                }))}
                placeholder="e.g. https://twitter.com/buildholding"
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
  
  // Render Contact Form Editor
  const renderContactFormEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-paper-plane me-2"></i> Contact Form
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('contactForm', 'title', 'Form Title')}
        {renderMultilingualInput('contactForm', 'description', 'Form Description', 'textarea')}
        
        <h6 className="mt-4 mb-3">Form Labels</h6>
        {renderMultilingualInput('contactForm', 'nameLabel', 'Name Field Label')}
        {renderMultilingualInput('contactForm', 'emailLabel', 'Email Field Label')}
        {renderMultilingualInput('contactForm', 'phoneLabel', 'Phone Field Label')}
        {renderMultilingualInput('contactForm', 'subjectLabel', 'Subject Field Label')}
        {renderMultilingualInput('contactForm', 'messageLabel', 'Message Field Label')}
        {renderMultilingualInput('contactForm', 'submitButton', 'Submit Button Text')}
        {renderMultilingualInput('contactForm', 'successMessage', 'Success Message', 'textarea')}
      </Card.Body>
    </Card>
  );
  
  // Render Map Settings Editor
  const renderMapEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-map-marked-alt me-2"></i> Map Settings
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('map', 'title', 'Map Section Title')}
        {renderMultilingualInput('map', 'description', 'Map Description')}
        {renderMultilingualInput('map', 'markerTitle', 'Map Marker Title')}
        
        <h6 className="mt-4 mb-3">Map Coordinates</h6>
        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Latitude</Form.Label>
              <Form.Control
                type="number"
                step="0.000001"
                value={formData.map.coordinates.lat}
                onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Longitude</Form.Label>
              <Form.Control
                type="number"
                step="0.000001"
                value={formData.map.coordinates.lng}
                onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
              />
            </Form.Group>
          </div>
        </div>
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Zoom Level (1-20)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="20"
            value={formData.map.zoom}
            onChange={(e) => handleInputChange('map', 'zoom', parseInt(e.target.value) || 15)}
            style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
  
  return (
    <div className="contact-admin-page">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0" style={{color: "#212529 !important"}}>
            <i className="fas fa-envelope me-2"></i> Contact Page Management
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
            <i className="fas fa-check-circle me-2"></i> Contact page content saved successfully!
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
                        eventKey="contactInfo" 
                        className={activeTab === "contactInfo" ? "active" : ""}
                        style={activeTab === "contactInfo" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-address-card me-2"></i> Contact Information
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="contactForm" 
                        className={activeTab === "contactForm" ? "active" : ""}
                        style={activeTab === "contactForm" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-paper-plane me-2"></i> Contact Form
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="map" 
                        className={activeTab === "map" ? "active" : ""}
                        style={activeTab === "map" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-map-marked-alt me-2"></i> Map Settings
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
                    <i className="fas fa-info-circle me-1 text-primary"></i> For map coordinates, use decimal format (e.g. 42.697708).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-9">
              <Tab.Content>
                <Tab.Pane eventKey="hero">
                  {renderHeroEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="contactInfo">
                  {renderContactInfoEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="contactForm">
                  {renderContactFormEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="map">
                  {renderMapEditor()}
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
};

export default ContactAdmin;
