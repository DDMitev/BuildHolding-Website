import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import { getProjects } from '../firebase/projectService';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/600x400?text=BuildHolding+Project");
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Define a guaranteed image URL
    let url = "https://via.placeholder.com/600x400?text=BuildHolding+Project";
    
    // Try to get an image from the project
    if (project?.images && project.images[0]?.url && project.images[0].url.startsWith('http')) {
      url = project.images[0].url;
    } else if (project?.mainImageUrl && project.mainImageUrl.startsWith('http')) {
      url = project.mainImageUrl;
    }
    
    // Set the image URL
    setImageUrl(url);
    
    // Preload the image
    const img = new Image();
    img.src = url;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error("Failed to load image:", url);
      setImageUrl("https://via.placeholder.com/600x400?text=BuildHolding+Project");
      setImageLoaded(true);
    };
  }, [project]);
  
  if (!project) return null;
  
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card project-card h-100">
        <div className="position-relative">
          <img 
            src={imageUrl}
            className="card-img-top" 
            alt={project.title?.en || "Project"} 
            style={{ 
              height: '240px', 
              objectFit: 'cover',
              backgroundColor: '#f8f9fa'
            }}
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
        <div className="card-body">
          <h3 className="card-title h5">{project.title?.en}</h3>
          <p className="card-text small text-muted">
            {project.category?.en}
          </p>
          <p className="card-text">
            {project.shortDescription?.en || 
              (project.description?.en?.length > 100 
                ? `${project.description.en.substring(0, 100)}...` 
                : project.description?.en)
            }
          </p>
          <Link to={`/projects/${project.id}`} className="btn btn-sm btn-outline-primary">
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
        // Fetch projects from Firebase
        const projectsData = await getProjects();
        
        if (projectsData && projectsData.length > 0) {
          console.log("Firebase Projects:", projectsData);
          setProjects(projectsData);
          setFilteredProjects(projectsData);
        } else {
          console.error("No projects found in Firebase");
          setError("No projects found");
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects from Firebase:", err);
        setError(err.message || "Failed to load projects");
        setProjects([]);
        setFilteredProjects([]);
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
              <label className="form-label">{t('projects.filters.category')}</label>
              <select 
                className="form-select" 
                name="category" 
                value={filter.category}
                onChange={handleFilterChange}
              >
                <option value="all">{t('projects.filters.allCategories')}</option>
                {getCategories().filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label">{t('projects.filters.status')}</label>
              <select 
                className="form-select"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
              >
                <option value="all">{t('projects.filters.allStatuses')}</option>
                {getStatuses().filter(st => st !== 'all').map(status => (
                  <option key={status} value={status}>
                    {status === 'in-progress' 
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
          
          {/* Projects */}
          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  {t('projects.error')}: {error}
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info" role="alert">
                  {t('projects.noResults')}
                </div>
              </div>
            ) : (
              filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id || project._id} 
                  project={project} 
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
