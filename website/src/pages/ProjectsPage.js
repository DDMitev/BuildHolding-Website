import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import hardcodedProjects from '../data/hardcoded-projects';
import { projectService } from '../services/api.service';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  
  if (!project) return null;
  
  // Helper function to ensure image URLs resolve correctly
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/600x400?text=BuildHolding+Project";
    
    // If it's already an absolute URL (starts with http or https), use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // For relative URLs, ensure they're properly resolved
    // If the URL starts with a slash, it's already relative to the root
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Otherwise, add a slash to make it relative to the root
    return `/${imageUrl}`;
  };
  
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card project-card h-100" style={{ 
        backgroundColor: '#ffffff !important',
        border: '1px solid #dee2e6'
      }}>
        <div className="position-relative">
          <img 
            src={getImageUrl(
              project.images && project.images[0]?.url 
                ? project.images[0].url 
                : (project.mainImageUrl || "")
            )}
            className="card-img-top" 
            alt={project.title?.en || "Project"} 
            style={{ height: '240px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/600x400?text=BuildHolding+Project";
            }}
          />
          <div className="position-absolute top-0 end-0 p-2">
            <span className={`badge ${
              project.status === 'complete' ? 'bg-success' : 
              project.status === 'in-progress' ? 'bg-warning' : 'bg-info'
            }`} style={{ color: 'white !important' }}>
              {project.status === 'in-progress' 
                ? t('projects.filters.inProgress')
                : project.status === 'planned'
                  ? t('projects.filters.planned')
                  : t('projects.filters.complete')
              }
            </span>
          </div>
        </div>
        <div className="card-body" style={{ backgroundColor: '#ffffff !important' }}>
          <h3 className="card-title h5" style={{ color: '#212529 !important', fontWeight: 'bold' }}>{project.title?.en}</h3>
          <p className="card-text small text-muted" style={{ color: '#6c757d !important' }}>
            {project.category?.en}
          </p>
          <p className="card-text" style={{ color: '#495057 !important' }}>
            {project.shortDescription?.en || 
              (project.description?.en?.length > 100 
                ? `${project.description.en.substring(0, 100)}...` 
                : project.description?.en)
            }
          </p>
          <Link to={`/projects/${project._id || project.id}`} className="btn btn-sm btn-outline-primary" style={{ color: '#0056b3 !important', borderColor: '#0056b3' }}>
            {t('home.featured.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all'
  });
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Attempt to fetch projects from API
        const response = await projectService.getAll();
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          console.log("API Projects:", response.data.data);
          setProjects(response.data.data);
          setFilteredProjects(response.data.data);
        } else {
          // Fallback to hardcoded data if API returns empty data
          console.log("Falling back to hardcoded projects");
          setProjects(hardcodedProjects);
          setFilteredProjects(hardcodedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err);
        
        // Fallback to hardcoded data on error
        setProjects(hardcodedProjects);
        setFilteredProjects(hardcodedProjects);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      setFilteredProjects([]);
      return;
    }
    
    let result = [...projects];
    
    if (filter.category !== 'all') {
      result = result.filter(project => 
        project.category && 
        project.category.en && 
        project.category.en.toLowerCase() === filter.category.toLowerCase()
      );
    }
    
    if (filter.status !== 'all') {
      result = result.filter(project => 
        project.status && 
        project.status.toLowerCase() === filter.status.toLowerCase()
      );
    }
    
    setFilteredProjects(result);
  }, [filter, projects]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get unique categories from projects
  const getCategories = () => {
    if (!Array.isArray(projects)) return ['all'];
    const categories = projects.map(project => project.category?.en).filter(Boolean);
    return ['all', ...new Set(categories)];
  };
  
  // Get unique statuses from projects
  const getStatuses = () => {
    if (!Array.isArray(projects)) return ['all'];
    const statuses = projects.map(project => project.status).filter(Boolean);
    return ['all', ...new Set(statuses)];
  };
  
  return (
    <div className="projects-page">
      <HeroSection 
        title={t('projects.hero.title')}
        subtitle={t('projects.hero.subtitle')}
        backgroundImage="/images/projects-bg.jpg"
        height="50vh"
      />
      
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label" style={{ color: '#212529' }}>{t('projects.filters.category')}</label>
              <select 
                className="form-select" 
                name="category" 
                value={filter.category}
                onChange={handleFilterChange}
                style={{ color: '#212529', backgroundColor: '#ffffff' }}
              >
                {getCategories().map((category, index) => (
                  <option key={index} value={category.toLowerCase()}>
                    {category === 'all' ? t('projects.filters.allCategories') : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label" style={{ color: '#212529' }}>{t('projects.filters.status')}</label>
              <select 
                className="form-select" 
                name="status" 
                value={filter.status}
                onChange={handleFilterChange}
                style={{ color: '#212529', backgroundColor: '#ffffff' }}
              >
                {getStatuses().map((status, index) => (
                  <option key={index} value={status.toLowerCase()}>
                    {status === 'all' 
                      ? t('projects.filters.allStatuses') 
                      : status === 'in-progress' 
                        ? t('projects.filters.inProgress')
                        : status === 'planned'
                          ? t('projects.filters.planned')
                          : t('projects.filters.complete')
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Project Grid */}
          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="page-loader">
                  <div className="logo-pulse-container">
                    <div className="logo-pulse">BH</div>
                  </div>
                </div>
              </div>
            ) : filteredProjects && filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard key={`project-${project._id || project.id || index}`} project={project} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p style={{color: '#495057'}}>No projects found matching the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
