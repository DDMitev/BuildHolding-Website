import React, { useState, useEffect } from 'react';
import { Card, Nav, Tab, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as holdingContentService from '../../services/holdingContentService';

const OurHoldingAdmin = () => {
  const { t, i18n } = useTranslation();
  const languages = ['en', 'bg', 'ru'];
  const currentLanguage = i18n.language || 'en';
  
  const [formData, setFormData] = useState(holdingContentService.getHoldingContent());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [activeContentTab, setActiveContentTab] = useState('mission'); // For content tabs navigation
  
  const handleSave = () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      const success = holdingContentService.saveHoldingContent(formData);
      
      if (success) {
        setSaveSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('An error occurred while saving the data.');
      }
    } catch (error) {
      console.error('Error saving holding content:', error);
      setSaveError(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all Our Holding page content to default values? This cannot be undone.')) {
      setFormData(holdingContentService.default.defaultHoldingContent);
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
  
  // Handle nested multilingual input change (for tabs, team members, etc.)
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
  
  // Handle core value change
  const handleValueChange = (index, field, language, value) => {
    const updatedValues = [...formData.values.items];
    
    if (language) {
      // Update multilingual field
      updatedValues[index] = {
        ...updatedValues[index],
        [field]: {
          ...updatedValues[index][field],
          [language]: value
        }
      };
    } else {
      // Update simple field
      updatedValues[index] = {
        ...updatedValues[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: updatedValues
      }
    }));
  };
  
  // Handle statistic change
  const handleStatChange = (index, field, language, value) => {
    const updatedStats = [...formData.stats.items];
    
    if (language) {
      // Update multilingual field
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: {
          ...updatedStats[index][field],
          [language]: value
        }
      };
    } else {
      // Update simple field with numeric validation for numbers
      let processedValue = value;
      if (field === 'number') {
        processedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
      }
      
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: processedValue
      };
    }
    
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        items: updatedStats
      }
    }));
  };
  
  // Handle team member change
  const handleTeamMemberChange = (index, field, language, value) => {
    const updatedMembers = [...formData.team.members];
    
    if (language) {
      // Update multilingual field
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: {
          ...updatedMembers[index][field],
          [language]: value
        }
      };
    } else {
      // Update simple field
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
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
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Background Image URL</Form.Label>
          <Form.Control
            type="text"
            value={formData.hero.backgroundImage || ''}
            onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
            placeholder="e.g. /images/hero-holding.jpg"
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
  
  // Render Overview Section Editor
  const renderOverviewEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-info-circle me-2"></i> Company Overview
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('overview', 'title', 'Section Title')}
        {renderMultilingualInput('overview', 'description', 'Company Description', 'textarea')}
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Overview Image URL</Form.Label>
          <Form.Control
            type="text"
            value={formData.overview.image || ''}
            onChange={(e) => handleInputChange('overview', 'image', e.target.value)}
            placeholder="e.g. /images/about.jpg"
            style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
          />
          {formData.overview.image && (
            <div className="mt-2">
              <img 
                src={formData.overview.image} 
                alt="Overview Image Preview"
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
  
  // Render Core Values Editor
  const renderValuesEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-award me-2"></i> Core Values
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('values', 'title', 'Section Title')}
        
        <h6 className="mt-4 mb-3">Core Values</h6>
        
        {formData.values.items.map((value, index) => (
          <Card key={index} className="mb-3 border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
              <h6 className="mb-0">Value #{index + 1}: {value.title[currentLanguage] || value.title.en}</h6>
            </Card.Header>
            <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Icon (FontAwesome)</Form.Label>
                <Form.Control
                  type="text"
                  value={value.icon || ''}
                  onChange={(e) => handleValueChange(index, 'icon', null, e.target.value)}
                  placeholder="e.g. fas fa-handshake"
                  style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                />
                {value.icon && (
                  <div className="mt-2">
                    <i className={`${value.icon} fa-2x text-primary`}></i>
                  </div>
                )}
              </Form.Group>
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={value.title[lang] || ''}
                    onChange={(e) => handleValueChange(index, 'title', lang, e.target.value)}
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
                    value={value.description[lang] || ''}
                    onChange={(e) => handleValueChange(index, 'description', lang, e.target.value)}
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
  
  // Render Statistics Editor
  const renderStatsEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-chart-bar me-2"></i> Company Statistics
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('stats', 'title', 'Section Title')}
        
        <h6 className="mt-4 mb-3">Statistics</h6>
        
        {formData.stats.items.map((stat, index) => (
          <Card key={index} className="mb-3 border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
              <h6 className="mb-0">Statistic #{index + 1}</h6>
            </Card.Header>
            <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Number Value</Form.Label>
                <Form.Control
                  type="number"
                  value={stat.number || 0}
                  onChange={(e) => handleStatChange(index, 'number', null, e.target.value)}
                  style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                />
              </Form.Group>
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={stat.label[lang] || ''}
                    onChange={(e) => handleStatChange(index, 'label', lang, e.target.value)}
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
  
  // Render Tabs Editor
  const renderTabsEditor = () => {
    const tabKeys = Object.keys(formData.tabs);
    
    return (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-folder-open me-2"></i> Content Tabs
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        <div className="mb-4">
          <p className="text-muted mb-3">
            <i className="fas fa-info-circle me-2"></i>
            Manage the content tabs displayed on the Our Holding page. Each tab has a title and content in multiple languages.
          </p>
          
          {/* Navigation tabs for content sections */}
          <Nav variant="tabs" className="mb-3 nav-fill">
            {tabKeys.map(tabKey => (
              <Nav.Item key={tabKey}>
                <Nav.Link 
                  eventKey={tabKey} 
                  className={`text-capitalize ${activeContentTab === tabKey ? "active" : ""}`}
                  onClick={() => setActiveContentTab(tabKey)}
                  style={activeContentTab === tabKey ? 
                    {backgroundColor: "#0d6efd !important", color: "#ffffff !important", borderColor: "#0d6efd !important"} : 
                    {color: "#495057 !important", backgroundColor: "#ffffff !important"}}
                >
                  {tabKey}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          
          {/* Tab content editor */}
          <div className="tab-content p-3 border border-top-0 rounded-bottom" style={{backgroundColor: "#ffffff !important"}}>
            {tabKeys.map(tabKey => (
              <div 
                key={tabKey} 
                className={`tab-pane fade ${activeContentTab === tabKey ? 'show active' : ''}`}
                style={{display: activeContentTab === tabKey ? 'block' : 'none'}}
              >
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold d-block">Tab Icon (FontAwesome class)</Form.Label>
                  <div className="input-group mb-3">
                    <span className="input-group-text" style={{backgroundColor: "#e9ecef !important", color: "#333333 !important"}}>
                      <i className={formData.tabs[tabKey].icon || "fas fa-info-circle"}></i>
                    </span>
                    <Form.Control
                      type="text"
                      value={formData.tabs[tabKey].icon || ''}
                      onChange={(e) => handleNestedMultilingualChange('tabs', tabKey, 'icon', null, e.target.value)}
                      placeholder="fas fa-info-circle"
                      style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                    />
                  </div>
                  
                  <hr className="my-4" />
                  
                  <Form.Label className="fw-bold">Tab Titles</Form.Label>
                  {languages.map(lang => (
                    <div key={lang} className="input-group mb-2">
                      <span className="input-group-text" style={{backgroundColor: "#e9ecef !important", color: "#333333 !important"}}>
                        {lang.toUpperCase()}
                      </span>
                      <Form.Control
                        type="text"
                        value={formData.tabs[tabKey].title[lang] || ''}
                        onChange={(e) => handleNestedMultilingualChange('tabs', tabKey, 'title', lang, e.target.value)}
                        placeholder={`${tabKey.charAt(0).toUpperCase() + tabKey.slice(1)} title in ${lang.toUpperCase()}`}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      />
                    </div>
                  ))}
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Tab Content</Form.Label>
                  {languages.map(lang => (
                    <div key={lang} className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-primary me-2" style={{backgroundColor: "#0d6efd !important", color: "#ffffff !important"}}>
                          {lang.toUpperCase()}
                        </span>
                        <Form.Label className="mb-0">Content</Form.Label>
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={formData.tabs[tabKey].content[lang] || ''}
                        onChange={(e) => handleNestedMultilingualChange('tabs', tabKey, 'content', lang, e.target.value)}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      />
                    </div>
                  ))}
                </Form.Group>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
    );
  };
  
  // Render Team Editor
  const renderTeamEditor = () => (
    <Card className="mb-4" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
      <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
        <h5 className="mb-0">
          <i className="fas fa-users me-2"></i> Leadership Team
        </h5>
      </Card.Header>
      <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
        {renderMultilingualInput('team', 'title', 'Section Title')}
        
        <h6 className="mt-4 mb-3">Team Members</h6>
        
        {formData.team.members.map((member, index) => (
          <Card key={index} className="mb-3 border" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <Card.Header style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
              <h6 className="mb-0">Team Member: {member.name}</h6>
            </Card.Header>
            <Card.Body style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={member.name || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'name', null, e.target.value)}
                  style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Profile Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={member.image || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'image', null, e.target.value)}
                  placeholder="e.g. /images/team/member1.jpg"
                  style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                />
                {member.image && (
                  <div className="mt-2">
                    <img 
                      src={member.image} 
                      alt={`${member.name} Preview`}
                      className="img-thumbnail" 
                      style={{maxHeight: '100px'}}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
              </Form.Group>
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Position Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={member.position[lang] || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'position', lang, e.target.value)}
                    style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                  />
                </div>
              ))}
              
              {languages.map(lang => (
                <div key={lang} className="mb-3">
                  <Form.Label className="fw-bold">{lang.toUpperCase()} Biography</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={member.bio[lang] || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'bio', lang, e.target.value)}
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
  
  return (
    <div className="our-holding-admin-page">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0" style={{color: "#212529 !important"}}>
            <i className="fas fa-building me-2"></i> Our Holding Management
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
            <i className="fas fa-check-circle me-2"></i> Our Holding page content saved successfully!
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
                        eventKey="overview" 
                        className={activeTab === "overview" ? "active" : ""}
                        style={activeTab === "overview" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-info-circle me-2"></i> Company Overview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="values" 
                        className={activeTab === "values" ? "active" : ""}
                        style={activeTab === "values" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-award me-2"></i> Core Values
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="stats" 
                        className={activeTab === "stats" ? "active" : ""}
                        style={activeTab === "stats" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-chart-bar me-2"></i> Statistics
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="tabs" 
                        className={activeTab === "tabs" ? "active" : ""}
                        style={activeTab === "tabs" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-folder-open me-2"></i> Content Tabs
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="team" 
                        className={activeTab === "team" ? "active" : ""}
                        style={activeTab === "team" ? {backgroundColor: "#0d6efd !important", color: "#ffffff !important"} : {color: "#333333 !important"}}
                      >
                        <i className="fas fa-users me-2"></i> Leadership Team
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
                <Tab.Pane eventKey="overview">
                  {renderOverviewEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="values">
                  {renderValuesEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="stats">
                  {renderStatsEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="tabs">
                  {renderTabsEditor()}
                </Tab.Pane>
                <Tab.Pane eventKey="team">
                  {renderTeamEditor()}
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
};

export default OurHoldingAdmin;
