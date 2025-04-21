import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as projectStorage from '../services/projectStorage';

const ProjectAdmin = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: 'Images' },
    { id: 'details', label: 'Project Details' },
    { id: 'features', label: 'Features' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'team', label: 'Team & Client' }
  ];
  const languages = ['en', 'bg', 'ru'];
  const currentLanguage = i18n.language || 'en';
  
  // Deep copy function to properly clone nested objects
  const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  // Helper function to handle objects in React rendering
  const stringify = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Safe text renderer to prevent object rendering errors
  const SafeText = ({ value }) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return <span>{JSON.stringify(value)}</span>;
    return <span>{value}</span>;
  };

  // Load projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Load from localStorage or fallback to hardcoded data
        let storedProjects = projectStorage.initializeProjects();
        
        // Normalize data structure for gallery
        storedProjects = storedProjects.map(project => {
          if (!project.gallery && project.images) {
            project.gallery = project.images.map(img => img.url);
          } else if (!project.gallery) {
            project.gallery = [];
          }
          return project;
        });
        
        setProjects(deepCopy(storedProjects));
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      }
    };
    
    fetchProjects();
  }, []);

  // Normalize project data when it's loaded
  useEffect(() => {
    if (currentProject?.id && !editMode) {
      const normalizedProject = { ...currentProject };
      
      // Ensure the gallery is properly formatted for the frontend
      if (!normalizedProject.gallery && normalizedProject.images && Array.isArray(normalizedProject.images)) {
        normalizedProject.gallery = normalizedProject.images.map(img => img.url).filter(url => url);
        console.log('Converted images to gallery format:', normalizedProject.gallery);
      } else if (!normalizedProject.gallery) {
        normalizedProject.gallery = [];
      }
      
      setFormData(normalizedProject);
    }
  }, [currentProject, editMode]);

  // Convert legacy image format to gallery format when needed
  useEffect(() => {
    if (formData && formData.id) {
      let needsUpdate = false;
      const updatedFormData = { ...formData };
      
      // Convert from the old images array of objects to the new gallery array of strings
      if (!updatedFormData.gallery && updatedFormData.images && Array.isArray(updatedFormData.images)) {
        const galleryUrls = updatedFormData.images.map(img => img.url || '').filter(url => url && url.trim() !== '');
        updatedFormData.gallery = galleryUrls;
        needsUpdate = true;
        console.log("Converted legacy images format to gallery format:", galleryUrls);
      } else if (!updatedFormData.gallery) {
        updatedFormData.gallery = [];
        needsUpdate = true;
      }

      // Set the thumbnail from the main image if it doesn't exist
      if (!updatedFormData.thumbnail && updatedFormData.image) {
        updatedFormData.thumbnail = updatedFormData.image;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [formData?.id]);

  // Initialize default values for project details sections
  useEffect(() => {
    if (formData && formData.id) {
      const updatedFormData = {...formData};
      let needsUpdate = false;
      
      // Initialize specifications if not present
      if (!updatedFormData.specifications) {
        updatedFormData.specifications = {
          size: { value: 0, unit: 'm²' },
          capacity: { value: 0, unit: 'units' },
          sustainability: { features: [] }
        };
        needsUpdate = true;
      }
      
      // Initialize financial if not present
      if (!updatedFormData.financial) {
        updatedFormData.financial = {
          budget: { total: 0, currency: 'EUR' }
        };
        needsUpdate = true;
      }
      
      // Initialize location if not present
      if (!updatedFormData.location) {
        updatedFormData.location = {
          address: { en: '', bg: '', ru: '' },
          city: { en: '', bg: '', ru: '' },
          country: { en: '', bg: '', ru: '' },
          coordinates: { lat: 0, lng: 0 }
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [formData?.id]);

  // Handle project selection
  const handleSelectProject = (project) => {
    setCurrentProject(deepCopy(project));
    setFormData(deepCopy(project));
    setEditMode(false);
    setSaveSuccess(false);
    setSaveError(null);
    setActiveTab('basic');
  };

  // Handle edit button click
  const handleEditClick = () => {
    setEditMode(true);
    setFormData(deepCopy(currentProject));
    setSaveSuccess(false);
    setSaveError(null);
  };

  // Handle form field changes
  const handleChange = (e, field, lang = null, nestedField = null, nestedSubField = null) => {
    const { value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    let updatedFormData = { ...formData };
    
    if (nestedField && nestedSubField) {
      // Handle deeply nested fields (like specifications.area.total)
      updatedFormData[nestedField] = {
        ...updatedFormData[nestedField],
        [nestedSubField]: {
          ...updatedFormData[nestedField]?.[nestedSubField],
          [field]: finalValue
        }
      };
    } else if (nestedField) {
      // Handle nested fields (like specifications.area)
      updatedFormData[nestedField] = {
        ...updatedFormData[nestedField],
        [field]: finalValue
      };
    } else if (lang) {
      // Handle multilingual fields
      updatedFormData[field] = {
        ...updatedFormData[field],
        [lang]: finalValue
      };
    } else {
      // Handle regular fields
      updatedFormData[field] = finalValue;
    }
    
    setFormData(updatedFormData);
  };

  // Handle array changes for gallery images
  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray[index] = value;
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Add new item to an array
  const handleAddArrayItem = (field) => {
    const updatedArray = [...(formData[field] || []), ''];
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Remove item from an array
  const handleRemoveArrayItem = (field, index) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Update project data before saving
  const prepareDataForSave = () => {
    // Make a deep copy to avoid modifying the state directly
    const preparedData = { ...formData };
    
    // Ensure the gallery is properly formatted for the frontend
    if (preparedData.gallery && preparedData.gallery.length > 0) {
      // Check if all entries are valid URLs
      const validGallery = preparedData.gallery.filter(url => url && url.trim() !== '');
      preparedData.gallery = validGallery;
    }
    
    // If project still has the legacy images structure, convert it to gallery format
    if (preparedData.images && Array.isArray(preparedData.images) && (!preparedData.gallery || preparedData.gallery.length === 0)) {
      preparedData.gallery = preparedData.images.map(img => img.url).filter(url => url);
    }
    
    // Use thumbnail as main image for backward compatibility
    if (preparedData.thumbnail) {
      preparedData.image = preparedData.thumbnail;
      preparedData.mainImageUrl = preparedData.thumbnail;
    }
    
    return preparedData;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Prepare data before saving
      const dataToSave = prepareDataForSave();
      
      // Save the updated project data to localStorage
      const success = projectStorage.updateProject(formData.id, dataToSave);
      
      if (success) {
        setSaveSuccess(true);
        setSaveError(null);
        
        // Force the page to refresh local data from storage
        projectStorage.saveProjects(projectStorage.initializeProjects());
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError('Failed to save project. Please try again.');
        setSaveSuccess(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveError('Failed to save project. Please try again.');
      setSaveSuccess(false);
    }
  };

  // Helper function to safely render any value, handling objects properly
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      // If it's an object, don't try to render it directly
      return JSON.stringify(value);
    }
    return value;
  };

  // Render multilingual input fields
  const renderMultilingualInputs = (field, label, type = 'text') => {
    return (
      <div className="form-group mb-4">
        <label className="form-label fw-bold">{label}</label>
        {languages.map(lang => (
          <div key={lang} className="mb-2">
            <div className="input-group">
              <span className="input-group-text">{lang.toUpperCase()}</span>
              {type === 'textarea' ? (
                <textarea
                  className="form-control"
                  value={formData[field]?.[lang] || ''}
                  onChange={(e) => handleChange(e, field, lang)}
                  rows="3"
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={formData[field]?.[lang] || ''}
                  onChange={(e) => handleChange(e, field, lang)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render images editor
  const renderImagesEditor = () => {
    return (
      <div className="images-editor mb-4">
        <h5 className="mb-3">Project Images</h5>
        
        {/* Thumbnail Image */}
        <div className="card mb-3">
          <div className="card-header bg-light">Thumbnail Image</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-12">
                {formData.thumbnail && (
                  <div className="image-preview mb-3 text-center">
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail"
                      className="img-fluid rounded border" 
                      style={{ maxHeight: '150px', border: '1px solid #ccc', background: "#f8f9fa" }} 
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x200/e9ecef/6c757d?text=Thumbnail+Not+Found';
                        console.log("Error loading thumbnail:", formData.thumbnail);
                      }}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Thumbnail URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      thumbnail: e.target.value
                    })}
                    placeholder="Enter URL for thumbnail image"
                  />
                  <small className="form-text text-muted">
                    This image will be used as the project card thumbnail and also as the main image if no gallery images are available.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery */}
        <div className="card mb-3">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <span>Gallery Images</span>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setFormData({
                  ...formData,
                  gallery: [...(formData.gallery || []), '']
                });
              }}
            >
              Add Image
            </button>
          </div>
          <div className="card-body">
            {!formData.gallery || formData.gallery.length === 0 ? (
              <div className="alert alert-info">
                No gallery images added yet. Click "Add Image" to start building your gallery.
              </div>
            ) : (
              <div className="gallery-items">
                {formData.gallery.map((imageUrl, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          {imageUrl && (
                            <div className="image-preview mb-3">
                              <img 
                                src={imageUrl} 
                                alt={`Gallery ${index + 1}`}
                                className="img-fluid rounded border" 
                                style={{ 
                                  maxHeight: '120px', 
                                  border: '1px solid #ccc', 
                                  background: "#f8f9fa"
                                }} 
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/400x300/e9ecef/6c757d?text=Image+Not+Found';
                                  console.log("Error loading gallery image:", imageUrl);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={imageUrl}
                              onChange={(e) => {
                                const updatedGallery = [...formData.gallery];
                                updatedGallery[index] = e.target.value;
                                setFormData({
                                  ...formData,
                                  gallery: updatedGallery
                                });
                              }}
                              placeholder="Enter image URL"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => {
                                const updatedGallery = [...formData.gallery];
                                updatedGallery.splice(index, 1);
                                setFormData({
                                  ...formData,
                                  gallery: updatedGallery
                                });
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Debug Information */}
        <div className="card mb-3">
          <div className="card-header bg-light">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#imageDebugInfo" 
              aria-expanded="false"
            >
              Show Image Structure Debug Info
            </button>
          </div>
          <div className="collapse" id="imageDebugInfo">
            <div className="card-body">
              <div className="mb-3">
                <h6>Thumbnail URL: {formData.thumbnail || 'Not set'}</h6>
                <h6>Gallery Images: {formData.gallery?.length || 0} images</h6>
                <hr/>
                <pre style={{maxHeight: '200px', overflow: 'auto'}}>
                  {JSON.stringify({
                    thumbnail: formData.thumbnail,
                    gallery: formData.gallery
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render specifications editor
  const renderSpecificationsEditor = () => {
    const { specifications } = formData;
    if (!specifications) return null;

    return (
      <div className="specifications-editor mb-4">
        <h5 className="mb-3">Specifications</h5>
        
        {/* Area */}
        <div className="card mb-3">
          <div className="card-header bg-light">Area</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Total Area</label>
                  <input
                    type="number"
                    className="form-control"
                    value={specifications.area?.total || ''}
                    onChange={(e) => handleChange(e, 'total', null, 'specifications', 'area')}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={specifications.area?.unit || ''}
                    onChange={(e) => handleChange(e, 'unit', null, 'specifications', 'area')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floors */}
        <div className="card mb-3">
          <div className="card-header bg-light">Floors</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Above Ground</label>
                  <input
                    type="number"
                    className="form-control"
                    value={specifications.floors?.above || ''}
                    onChange={(e) => handleChange(e, 'above', null, 'specifications', 'floors')}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Below Ground</label>
                  <input
                    type="number"
                    className="form-control"
                    value={specifications.floors?.below || ''}
                    onChange={(e) => handleChange(e, 'below', null, 'specifications', 'floors')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render features editor
  const renderFeaturesEditor = () => {
    if (!formData.features) return (
      <div className="alert alert-info">
        This project doesn't have any features defined yet. Click the button below to add some.
        <button 
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => setFormData({
            ...formData,
            features: []
          })}
        >
          Add Features
        </button>
      </div>
    );

    return (
      <div className="features-editor mb-4">
        <h5 className="mb-3">Features List</h5>
        
        {formData.features.map((feature, index) => (
          <div key={index} className="card mb-3">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <span>Feature #{index + 1}</span>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => {
                  const updatedFeatures = [...formData.features];
                  updatedFeatures.splice(index, 1);
                  setFormData({
                    ...formData,
                    features: updatedFeatures
                  });
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="card-body">
              {languages.map(lang => (
                <div key={lang} className="mb-2">
                  <div className="input-group">
                    <span className="input-group-text">{lang.toUpperCase()}</span>
                    <input
                      type="text"
                      className="form-control"
                      value={feature[lang] || ''}
                      onChange={(e) => {
                        const updatedFeatures = [...formData.features];
                        updatedFeatures[index] = {
                          ...updatedFeatures[index],
                          [lang]: e.target.value
                        };
                        setFormData({
                          ...formData,
                          features: updatedFeatures
                        });
                      }}
                      placeholder={`Feature description in ${lang.toUpperCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="btn btn-outline-primary mt-2"
          onClick={() => {
            const newFeature = languages.reduce((obj, lang) => {
              obj[lang] = '';
              return obj;
            }, {});
            
            setFormData({
              ...formData,
              features: [...(formData.features || []), newFeature]
            });
          }}
        >
          Add Feature
        </button>
      </div>
    );
  };

  // Render timeline editor
  const renderTimelineEditor = () => {
    if (!formData.timeline) return (
      <div className="alert alert-info">
        This project doesn't have a timeline defined yet. Click the button below to add timeline phases.
        <button 
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => setFormData({
            ...formData,
            timeline: {}
          })}
        >
          Add Timeline
        </button>
      </div>
    );

    // Timeline phases we want to edit
    const phases = [
      'planning', 'foundation', 'structure', 'facade', 
      'interiors', 'landscaping', 'completion'
    ];

    // Function to update a specific phase
    const updatePhase = (phase, field, value) => {
      const updatedTimeline = { ...formData.timeline };
      if (!updatedTimeline[phase]) {
        updatedTimeline[phase] = {};
      }
      updatedTimeline[phase][field] = value;
      
      setFormData({
        ...formData,
        timeline: updatedTimeline
      });
    };

    return (
      <div className="timeline-editor mb-4">
        <h5 className="mb-3">Project Timeline</h5>
        
        {phases.map(phase => (
          <div key={phase} className="card mb-3">
            <div className="card-header bg-light text-capitalize">
              {phase} Phase
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.timeline[phase]?.start || ''}
                    onChange={(e) => updatePhase(phase, 'start', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.timeline[phase]?.end || ''}
                    onChange={(e) => updatePhase(phase, 'end', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${phase}-completed`}
                      checked={formData.timeline[phase]?.completed || false}
                      onChange={(e) => updatePhase(phase, 'completed', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`${phase}-completed`}>
                      Completed
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${phase}-inProgress`}
                      checked={formData.timeline[phase]?.inProgress || false}
                      onChange={(e) => updatePhase(phase, 'inProgress', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`${phase}-inProgress`}>
                      In Progress
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render financial editor
  const renderFinancialEditor = () => {
    if (!formData.financial) return (
      <div className="alert alert-info">
        This project doesn't have financial information defined yet. Click the button below to add financial data.
        <button 
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => setFormData({
            ...formData,
            financial: {
              budget: { total: 0, currency: 'EUR' },
              cost: { perSquareMeter: 0, unit: 'm²', currency: 'EUR' },
              roi: { percentage: 0, years: 0 }
            }
          })}
        >
          Add Financial Info
        </button>
      </div>
    );

    return (
      <div className="financial-editor mb-4">
        <h5 className="mb-3">Financial Information</h5>
        
        {/* Budget section */}
        <div className="card mb-3">
          <div className="card-header bg-light">Budget</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group mb-2">
                  <label className="form-label">Total Budget</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.financial?.budget?.total || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          budget: {
                            ...formData.financial?.budget,
                            total: value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-2">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    value={formData.financial?.budget?.currency || 'EUR'}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          budget: {
                            ...formData.financial?.budget,
                            currency: e.target.value
                          }
                        }
                      });
                    }}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="BGN">BGN</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cost per square meter */}
        <div className="card mb-3">
          <div className="card-header bg-light">Cost per Square Meter</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Cost per Square Meter</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.financial?.cost?.perSquareMeter || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          cost: {
                            ...formData.financial?.cost,
                            perSquareMeter: value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group mb-2">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.financial?.cost?.unit || 'm²'}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          cost: {
                            ...formData.financial?.cost,
                            unit: e.target.value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group mb-2">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    value={formData.financial?.cost?.currency || 'EUR'}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          cost: {
                            ...formData.financial?.cost,
                            currency: e.target.value
                          }
                        }
                      });
                    }}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="BGN">BGN</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ROI Information */}
        <div className="card mb-3">
          <div className="card-header bg-light">Return on Investment (ROI)</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">ROI Percentage</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.financial?.roi?.percentage || 0}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setFormData({
                          ...formData,
                          financial: {
                            ...formData.financial,
                            roi: {
                              ...formData.financial?.roi,
                              percentage: value
                            }
                          }
                        });
                      }}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">ROI Period (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.financial?.roi?.years || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        financial: {
                          ...formData.financial,
                          roi: {
                            ...formData.financial?.roi,
                            years: value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render location editor
  const renderLocationEditor = () => {
    if (!formData.location) {
      return (
        <div className="alert alert-info">
          This project doesn't have location information defined yet. Click the button below to add location data.
          <button 
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => setFormData({
              ...formData,
              location: {
                address: { en: '', bg: '', ru: '' },
                city: { en: '', bg: '', ru: '' },
                country: { en: '', bg: '', ru: '' },
                coordinates: { lat: 0, lng: 0 }
              }
            })}
          >
            Add Location Information
          </button>
        </div>
      );
    }

    return (
      <div className="location-editor mb-4">
        <h5 className="mb-3">Location Information</h5>
        
        {/* Address */}
        <div className="card mb-3">
          <div className="card-header bg-light">Address</div>
          <div className="card-body">
            {languages.map(lang => (
              <div key={lang} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location?.address?.[lang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          address: {
                            ...formData.location?.address,
                            [lang]: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Address in ${lang.toUpperCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* City */}
        <div className="card mb-3">
          <div className="card-header bg-light">City</div>
          <div className="card-body">
            {languages.map(lang => (
              <div key={lang} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location?.city?.[lang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          city: {
                            ...formData.location?.city,
                            [lang]: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`City in ${lang.toUpperCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Country */}
        <div className="card mb-3">
          <div className="card-header bg-light">Country</div>
          <div className="card-body">
            {languages.map(lang => (
              <div key={lang} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location?.country?.[lang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          country: {
                            ...formData.location?.country,
                            [lang]: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Country in ${lang.toUpperCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Coordinates */}
        <div className="card mb-3">
          <div className="card-header bg-light">Coordinates</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={formData.location?.coordinates?.lat || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          coordinates: {
                            ...formData.location?.coordinates,
                            lat: value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-2">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={formData.location?.coordinates?.lng || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          coordinates: {
                            ...formData.location?.coordinates,
                            lng: value
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render client information editor
  const renderClientEditor = () => {
    if (!formData.client) {
      return (
        <div className="alert alert-info">
          This project doesn't have client information defined yet. Click the button below to add client data.
          <button 
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => setFormData({
              ...formData,
              client: {
                name: { en: '', bg: '', ru: '' },
                industry: { en: '', bg: '', ru: '' },
                logo: ''
              }
            })}
          >
            Add Client Information
          </button>
        </div>
      );
    }

    return (
      <div className="client-editor mb-4">
        <h5 className="mb-3">Client Information</h5>
        
        {/* Client Name */}
        <div className="card mb-3">
          <div className="card-header bg-light">Client Name</div>
          <div className="card-body">
            {languages.map(lang => (
              <div key={lang} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.client?.name?.[lang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          name: {
                            ...formData.client?.name,
                            [lang]: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Client name in ${lang.toUpperCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Industry */}
        <div className="card mb-3">
          <div className="card-header bg-light">Industry</div>
          <div className="card-body">
            {languages.map(lang => (
              <div key={lang} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.client?.industry?.[lang] || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          industry: {
                            ...formData.client?.industry,
                            [lang]: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Industry in ${lang.toUpperCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Client Logo */}
        <div className="card mb-3">
          <div className="card-header bg-light">Client Logo</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-12">
                {formData.client?.logo && (
                  <div className="image-preview mb-3 text-center">
                    <img 
                      src={formData.client.logo} 
                      alt="Client logo"
                      className="img-fluid rounded border" 
                      style={{ maxHeight: '100px' }} 
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.client?.logo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {
                        ...formData.client,
                        logo: e.target.value
                      }
                    })}
                    placeholder="Enter URL for client logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render team information editor
  const renderTeamEditor = () => {
    if (!formData.team) {
      return (
        <div className="alert alert-info">
          This project doesn't have team information defined yet. Click the button below to add team data.
          <button 
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => setFormData({
              ...formData,
              team: {
                architects: [],
                contractors: [],
                consultants: []
              }
            })}
          >
            Add Team Information
          </button>
        </div>
      );
    }

    // Function to handle team member changes
    const handleTeamMemberChange = (category, index, field, lang, value) => {
      const updatedTeam = { ...formData.team };
      
      if (!updatedTeam[category][index]) {
        updatedTeam[category][index] = {};
      }
      
      if (!updatedTeam[category][index][field]) {
        updatedTeam[category][index][field] = {};
      }
      
      if (lang) {
        // For multilingual fields
        updatedTeam[category][index][field] = {
          ...updatedTeam[category][index][field],
          [lang]: value
        };
      } else {
        // For non-multilingual fields like logo
        updatedTeam[category][index][field] = value;
      }
      
      setFormData({
        ...formData,
        team: updatedTeam
      });
    };

    // Function to add a new team member
    const addTeamMember = (category) => {
      const updatedTeam = { ...formData.team };
      
      const newMember = {
        name: languages.reduce((obj, lang) => {
          obj[lang] = '';
          return obj;
        }, {}),
        role: languages.reduce((obj, lang) => {
          obj[lang] = '';
          return obj;
        }, {}),
        logo: ''
      };
      
      updatedTeam[category] = [...(updatedTeam[category] || []), newMember];
      
      setFormData({
        ...formData,
        team: updatedTeam
      });
    };

    // Function to remove a team member
    const removeTeamMember = (category, index) => {
      const updatedTeam = { ...formData.team };
      updatedTeam[category].splice(index, 1);
      
      setFormData({
        ...formData,
        team: updatedTeam
      });
    };

    // Function to render a team category
    const renderTeamCategory = (categoryName, categoryKey) => {
      return (
        <div className={`${categoryKey}-editor mb-4`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="m-0">{categoryName}</h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => addTeamMember(categoryKey)}
            >
              Add {categoryName.slice(0, -1)} {/* Remove the 's' to get singular */}
            </button>
          </div>
          
          {!formData.team[categoryKey] || formData.team[categoryKey].length === 0 ? (
            <div className="alert alert-info">
              No {categoryName.toLowerCase()} added yet. Click the button above to add one.
            </div>
          ) : (
            formData.team[categoryKey].map((member, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <span>{categoryName.slice(0, -1)} #{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeTeamMember(categoryKey, index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="card-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    {languages.map(lang => (
                      <div key={lang} className="input-group mb-2">
                        <span className="input-group-text">{lang.toUpperCase()}</span>
                        <input
                          type="text"
                          className="form-control"
                          value={member.name?.[lang] || ''}
                          onChange={(e) => handleTeamMemberChange(
                            categoryKey, 
                            index, 
                            'name', 
                            lang, 
                            e.target.value
                          )}
                          placeholder={`Name in ${lang.toUpperCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    {languages.map(lang => (
                      <div key={lang} className="input-group mb-2">
                        <span className="input-group-text">{lang.toUpperCase()}</span>
                        <input
                          type="text"
                          className="form-control"
                          value={member.role?.[lang] || ''}
                          onChange={(e) => handleTeamMemberChange(
                            categoryKey, 
                            index, 
                            'role', 
                            lang, 
                            e.target.value
                          )}
                          placeholder={`Role in ${lang.toUpperCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Logo */}
                  <div className="mb-3">
                    <label className="form-label">Logo</label>
                    {member.logo && (
                      <div className="image-preview mb-3 text-center">
                        <img 
                          src={member.logo} 
                          alt={`Logo`}
                          className="img-fluid rounded border" 
                          style={{ maxHeight: '80px' }} 
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      className="form-control"
                      value={member.logo || ''}
                      onChange={(e) => handleTeamMemberChange(
                        categoryKey, 
                        index, 
                        'logo', 
                        null, 
                        e.target.value
                      )}
                      placeholder="Enter logo URL"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      );
    };

    return (
      <div className="team-editor mb-4">
        <h5 className="mb-3">Team Information</h5>
        
        <div className="accordion" id="teamAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#architectsPanel"
              >
                Architects
              </button>
            </h2>
            <div id="architectsPanel" className="accordion-collapse collapse show" data-bs-parent="#teamAccordion">
              <div className="accordion-body">
                {renderTeamCategory('Architects', 'architects')}
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#contractorsPanel"
              >
                Contractors
              </button>
            </h2>
            <div id="contractorsPanel" className="accordion-collapse collapse" data-bs-parent="#teamAccordion">
              <div className="accordion-body">
                {renderTeamCategory('Contractors', 'contractors')}
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#consultantsPanel"
              >
                Consultants
              </button>
            </h2>
            <div id="consultantsPanel" className="accordion-collapse collapse" data-bs-parent="#teamAccordion">
              <div className="accordion-body">
                {renderTeamCategory('Consultants', 'consultants')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render project details editor
  const renderProjectDetailsEditor = () => {
    return (
      <div className="project-details-editor mb-4">
        <h5 className="mb-3">Project Details</h5>

        <div className="row mb-3">
          <div className="col-md-6">
            {/* Project Size */}
            <div className="card mb-3">
              <div className="card-header bg-light d-flex align-items-center" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
                <i className="fas fa-ruler me-2"></i> {t('projects.projectSize') || 'Project Size'}
              </div>
              <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group mb-2">
                      <label className="form-label">Size Value</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.specifications?.size?.value || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              size: {
                                ...formData.specifications?.size,
                                value: value
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-2">
                      <label className="form-label">Unit</label>
                      <select
                        className="form-select"
                        value={formData.specifications?.size?.unit || 'm²'}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              size: {
                                ...formData.specifications?.size,
                                unit: e.target.value
                              }
                            }
                          });
                        }}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      >
                        <option value="m²">m² (Square Meters)</option>
                        <option value="ha">ha (Hectares)</option>
                        <option value="km²">km² (Square Kilometers)</option>
                        <option value="acres">acres</option>
                      </select>
                    </div>
                  </div>
                </div>
                <small className="text-muted" style={{color: "#6c757d !important"}}>
                  For buildings: floor area. For solar: land area. For infrastructure: coverage area.
                </small>
              </div>
            </div>
            
            {/* Project Capacity */}
            <div className="card mb-3">
              <div className="card-header bg-light d-flex align-items-center" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
                <i className="fas fa-tachometer-alt me-2"></i> {t('projects.capacity') || 'Project Capacity'}
              </div>
              <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group mb-2">
                      <label className="form-label">Capacity Value</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.specifications?.capacity?.value || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              capacity: {
                                ...formData.specifications?.capacity,
                                value: value
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-2">
                      <label className="form-label">Unit</label>
                      <select
                        className="form-select"
                        value={formData.specifications?.capacity?.unit || 'units'}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              capacity: {
                                ...formData.specifications?.capacity,
                                unit: e.target.value
                              }
                            }
                          });
                        }}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      >
                        <option value="units">Units (e.g., apartments)</option>
                        <option value="MW">MW (Megawatts)</option>
                        <option value="kW">kW (Kilowatts)</option>
                        <option value="m³/day">m³/day (Cubic meters per day)</option>
                        <option value="tons">tons (Metric tons)</option>
                        <option value="vehicles">vehicles</option>
                        <option value="people">people</option>
                      </select>
                    </div>
                  </div>
                </div>
                <small className="text-muted" style={{color: "#6c757d !important"}}>
                  For power projects: power output. For buildings: number of units. For water: processing capacity.
                </small>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            {/* Project Duration */}
            <div className="card mb-3">
              <div className="card-header bg-light d-flex align-items-center" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
                <i className="fas fa-calendar-alt me-2"></i> Project Duration
              </div>
              <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group mb-2">
                      <label className="form-label">Duration Value</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.duration?.value || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData({
                            ...formData,
                            duration: {
                              ...formData.duration,
                              value: value
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-2">
                      <label className="form-label">Unit</label>
                      <select
                        className="form-select"
                        value={formData.duration?.unit || 'months'}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            duration: {
                              ...formData.duration,
                              unit: e.target.value
                            }
                          });
                        }}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                </div>
                <small className="text-muted" style={{color: "#6c757d !important"}}>
                  Total construction/installation duration from start to completion.
                </small>
              </div>
            </div>

            {/* Budget */}
            <div className="card mb-3">
              <div className="card-header bg-light d-flex align-items-center" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
                <i className="fas fa-money-bill-wave me-2"></i> Budget
              </div>
              <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group mb-2">
                      <label className="form-label">Total Budget</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.financial?.budget?.total || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            financial: {
                              ...formData.financial,
                              budget: {
                                ...formData.financial?.budget,
                                total: value
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-2">
                      <label className="form-label">Currency</label>
                      <select
                        className="form-select"
                        value={formData.financial?.budget?.currency || 'EUR'}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            financial: {
                              ...formData.financial,
                              budget: {
                                ...formData.financial?.budget,
                                currency: e.target.value
                              }
                            }
                          });
                        }}
                        style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="BGN">BGN</option>
                        <option value="RUB">RUB</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sustainability Features */}
        <div className="card mb-4">
          <div className="card-header bg-light d-flex align-items-center" style={{backgroundColor: "#f8f9fa !important", color: "#333333 !important"}}>
            <i className="fas fa-leaf me-2"></i> Sustainability Features
          </div>
          <div className="card-body" style={{backgroundColor: "#ffffff !important", color: "#333333 !important"}}>
            <div className="form-group mb-3">
              <label className="form-label">Sustainable Features</label>
              {!formData.specifications?.sustainability?.features ||
                formData.specifications.sustainability.features.length === 0 ? (
                <div className="alert alert-info">
                  No sustainability features defined. Click the button below to add one.
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => {
                      const newFeature = languages.reduce((obj, lang) => {
                        obj[lang] = '';
                        return obj;
                      }, {});
                      
                      const updatedSpecs = {...formData.specifications};
                      if (!updatedSpecs.sustainability) {
                        updatedSpecs.sustainability = { features: [] };
                      }
                      if (!updatedSpecs.sustainability.features) {
                        updatedSpecs.sustainability.features = [];
                      }
                      
                      updatedSpecs.sustainability.features = [
                        ...updatedSpecs.sustainability.features,
                        newFeature
                      ];
                      
                      setFormData({
                        ...formData,
                        specifications: updatedSpecs
                      });
                    }}
                  >
                    Add Sustainability Feature
                  </button>
                </div>
              ) : (
                <>
                  {formData.specifications.sustainability.features.map((feature, index) => (
                    <div key={index} className="mb-3 border-bottom pb-2">
                      {languages.map(lang => (
                        <div key={lang} className="input-group mb-2">
                          <span className="input-group-text">{lang.toUpperCase()}</span>
                          <input
                            type="text"
                            className="form-control"
                            value={feature[lang] || ''}
                            onChange={(e) => {
                              const updatedFeatures = [...formData.specifications.sustainability.features];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                [lang]: e.target.value
                              };
                              
                              setFormData({
                                ...formData,
                                specifications: {
                                  ...formData.specifications,
                                  sustainability: {
                                    ...formData.specifications.sustainability,
                                    features: updatedFeatures
                                  }
                                }
                              });
                            }}
                            placeholder={`Feature in ${lang.toUpperCase()}`}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                              const updatedFeatures = [...formData.specifications.sustainability.features];
                              updatedFeatures.splice(index, 1);
                              
                              setFormData({
                                ...formData,
                                specifications: {
                                  ...formData.specifications,
                                  sustainability: {
                                    ...formData.specifications.sustainability,
                                    features: updatedFeatures
                                  }
                                }
                              });
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const newFeature = languages.reduce((obj, lang) => {
                        obj[lang] = '';
                        return obj;
                      }, {});
                      
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          sustainability: {
                            ...formData.specifications.sustainability,
                            features: [
                              ...formData.specifications.sustainability.features,
                              newFeature
                            ]
                          }
                        }
                      });
                    }}
                  >
                    Add Another Feature
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="project-admin">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="m-0">Projects</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {projects.map(project => (
                  <button
                    key={project.id}
                    className={`list-group-item list-group-item-action ${currentProject?.id === project.id ? 'active' : ''}`}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div><SafeText value={project.title[currentLanguage] || project.title.en} /></div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="badge bg-secondary"><SafeText value={project.status} /></span>
                      {project.featured && <span className="badge bg-warning">Featured</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card mt-3">
            <div className="card-header bg-primary text-white">
              <h5 className="m-0">Data Management</h5>
            </div>
            <div className="card-body">
              <p className="small mb-2">Export or reset your data as needed.</p>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const jsonData = JSON.stringify(projects, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'projects-data.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  Export JSON
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset to default data? All your changes will be lost.')) {
                      const defaultProjects = projectStorage.resetToDefaults();
                      setProjects(deepCopy(defaultProjects));
                      setCurrentProject(null);
                      setEditMode(false);
                      setSaveSuccess(false);
                      setSaveError(null);
                      
                      // Show success message
                      alert('Data has been reset to defaults.');
                    }
                  }}
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          {currentProject ? (
            <div className="card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="m-0">
                  {editMode ? 'Edit Project' : <SafeText value={currentProject.title[currentLanguage] || currentProject.title.en} />}
                </h5>
                {!editMode && (
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                {saveSuccess && (
                  <div className="alert alert-success">
                    Project saved successfully! Your changes have been stored in the browser. 
                  </div>
                )}
                
                {saveError && (
                  <div className="alert alert-danger"><SafeText value={saveError} /></div>
                )}
                
                {editMode ? (
                  <form onSubmit={handleSubmit}>
                    {/* Tab navigation for different sections */}
                    <ul className="nav nav-tabs mb-4">
                      {tabs.map(tab => (
                        <li key={tab.id} className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Project Details Tab */}
                    {activeTab === 'basic' && (
                      <div className="tab-content">
                        {/* ID field */}
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.id || ''}
                            disabled
                          />
                        </div>
                        
                        {/* Multilingual fields */}
                        {renderMultilingualInputs('title', 'Title')}
                        {renderMultilingualInputs('description', 'Description', 'textarea')}
                        {renderMultilingualInputs('shortDescription', 'Short Description')}
                        {renderMultilingualInputs('category', 'Category')}
                        {renderMultilingualInputs('subcategory', 'Subcategory')}
                        
                        {/* Status */}
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">Status</label>
                          <select
                            className="form-select"
                            value={formData.status || ''}
                            onChange={(e) => handleChange(e, 'status')}
                          >
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="complete">Complete</option>
                          </select>
                        </div>
                        
                        {/* Featured */}
                        <div className="form-check mb-4">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="featuredCheck"
                            checked={formData.featured || false}
                            onChange={(e) => handleChange(e, 'featured')}
                          />
                          <label className="form-check-label" htmlFor="featuredCheck">
                            Featured Project
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {/* Images Tab */}
                    {activeTab === 'images' && (
                      <div className="tab-content">
                        {renderImagesEditor()}
                      </div>
                    )}
                    
                    {/* Project Details Tab */}
                    {activeTab === 'details' && (
                      <div className="tab-content">
                        {renderProjectDetailsEditor()}
                      </div>
                    )}
                    
                    {/* Features Tab */}
                    {activeTab === 'features' && (
                      <div className="tab-content">
                        {renderFeaturesEditor()}
                      </div>
                    )}
                    
                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                      <div className="tab-content">
                        {renderTimelineEditor()}
                      </div>
                    )}
                    
                    {/* Team & Client Tab */}
                    {activeTab === 'team' && (
                      <div className="tab-content">
                        {renderTeamEditor()}
                        {renderClientEditor()}
                      </div>
                    )}
                    
                    <div className="d-flex gap-2 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditMode(false);
                          setFormData(deepCopy(currentProject));
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="project-details">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-4">
                          <strong>ID:</strong> <SafeText value={currentProject.id} />
                        </div>
                        
                        <div className="mb-4">
                          <strong>Title:</strong>
                          <ul className="list-unstyled ms-3">
                            {languages.map(lang => (
                              <li key={lang}>
                                <strong>{lang.toUpperCase()}:</strong> <SafeText value={currentProject.title[lang]} />
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-4">
                          <strong>Short Description:</strong>
                          <ul className="list-unstyled ms-3">
                            {languages.map(lang => (
                              <li key={lang}>
                                <strong>{lang.toUpperCase()}:</strong> <SafeText value={currentProject.shortDescription?.[lang]} />
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-4">
                          <strong>Category:</strong>
                          <ul className="list-unstyled ms-3">
                            {languages.map(lang => (
                              <li key={lang}>
                                <strong>{lang.toUpperCase()}:</strong> <SafeText value={currentProject.category?.[lang]} />
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-4">
                          <strong>Status:</strong> <SafeText value={currentProject.status} />
                        </div>
                        
                        <div className="mb-4">
                          <strong>Featured:</strong> {currentProject.featured ? 'Yes' : 'No'}
                        </div>
                        
                        {currentProject.specifications && (
                          <div className="mb-4">
                            <strong>Specifications:</strong>
                            <ul className="list-unstyled ms-3">
                              {currentProject.specifications.size && (
                                <li>
                                  <strong>Size:</strong> {currentProject.specifications.size.value} {currentProject.specifications.size.unit}
                                </li>
                              )}
                              {currentProject.specifications.capacity && (
                                <li>
                                  <strong>Capacity:</strong> {currentProject.specifications.capacity.value} {currentProject.specifications.capacity.unit}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-4">
                        {currentProject.thumbnail && (
                          <div className="mb-4">
                            <strong>Thumbnail:</strong>
                            <div className="mt-2">
                              <img 
                                src={currentProject.thumbnail} 
                                alt="Thumbnail"
                                className="img-thumbnail" 
                                style={{ maxHeight: '100px' }} 
                              />
                            </div>
                          </div>
                        )}
                        
                        {currentProject.gallery && currentProject.gallery.length > 0 && (
                          <div className="mb-4">
                            <strong>Gallery ({currentProject.gallery.length} images):</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {currentProject.gallery.map((img, index) => (
                                <img 
                                  key={index}
                                  src={img} 
                                  alt={`Gallery ${index+1}`}
                                  className="img-thumbnail" 
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="mb-0">Select a project to view or edit its details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAdmin;
