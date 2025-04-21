import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import hardcodedProjects from '../data/hardcoded-projects';
import { projectService } from '../services/api.service';
import * as homeContentService from '../services/homeContentService';
import * as projectStorage from '../services/projectStorage';

const FeaturedProject = ({ project }) => {
  if (!project) return null;
  
  return (
    <div className="col-lg-6 mb-4">
      <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff'}}>
        <div className="position-relative">
          <img 
            src={project.images && project.images[0]?.url 
              ? project.images[0].url 
              : (project.mainImageUrl || "https://via.placeholder.com/600x400?text=BuildHolding")}
            className="card-img-top" 
            alt={project.title?.en || "Project"}
            style={{ height: "240px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/600x400?text=BuildHolding";
            }}
          />
          <span className="position-absolute top-0 end-0 badge bg-secondary m-3">
            {project.status === 'planned' ? 'Planned' : 
             project.status === 'in-progress' ? 'In Progress' : 
             project.status === 'complete' ? 'Complete' : 
             project.status || "In Progress"}
          </span>
        </div>
        <div className="card-body bg-white">
          <h3 className="card-title h4 text-dark !important">{project.title?.en || "Project Title"}</h3>
          <p className="card-text text-muted mb-3">
            <i className="fas fa-map-marker-alt me-2"></i>
            {project.location?.address?.en || "Sofia, Bulgaria"}
          </p>
          <p className="card-text mb-4 text-dark !important">
            {project.shortDescription?.en || project.description?.en || "Project description goes here"}
          </p>
          <Link to={`/projects/${project._id || project.id || "1"}`} className="btn btn-outline-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  
  useEffect(() => {
    // Load content from homeContentService
    const content = homeContentService.getHomeContent();
    setPageContent(content);
    
    const loadFeaturedProjects = async () => {
      try {
        setLoading(true);
        
        // First try to get projects from projectStorage (localStorage)
        const storedProjects = projectStorage.getProjects();
        
        if (storedProjects && storedProjects.length > 0) {
          console.log("Using projects from localStorage");
          // Filter for featured projects
          const featuredFromStorage = storedProjects.filter(p => p.featured === true).slice(0, 4);
          
          if (featuredFromStorage.length > 0) {
            setFeaturedProjects(featuredFromStorage);
            setLoading(false);
            return;
          }
        }
        
        // If no projects in localStorage, try API
        const response = await projectService.getFeatured(4);
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          console.log("Using featured projects from API");
          setFeaturedProjects(response.data.data);
        } else {
          // Final fallback to hardcoded data
          console.log("Falling back to hardcoded projects");
          const featured = hardcodedProjects.filter(p => p.featured === true);
          setFeaturedProjects(featured);
        }
      } catch (err) {
        console.error("Error fetching featured projects:", err);
        setError(err);
        
        // Fallback to hardcoded data on error
        const featured = hardcodedProjects.filter(p => p.featured === true);
        setFeaturedProjects(featured);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedProjects();
  }, []);

  return (
    <div className="home-page">
      <HeroSection 
        title={pageContent?.hero?.title?.[t('language')] || pageContent?.hero?.title?.en || t('home.hero.title')}
        subtitle={pageContent?.hero?.subtitle?.[t('language')] || pageContent?.hero?.subtitle?.en || t('home.hero.subtitle')}
        backgroundImage={pageContent?.hero?.backgroundImage || "/images/hero-bg.jpg"}
        height="70vh"
        overlayOpacity={0.6}
        buttons={[
          { 
            text: pageContent?.hero?.buttonText?.[t('language')] || pageContent?.hero?.buttonText?.en || t('home.hero.buttonText'), 
            path: '/projects', 
            variant: 'btn-secondary btn-lg' 
          }
        ]}
      />
      
      {/* About Section */}
      <section className="about-section py-5 bg-light" style={{backgroundColor: '#f8f9fa !important'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={pageContent?.about?.image || "/images/about-img.jpg"} 
                alt="About BuildHolding" 
                className="img-fluid rounded shadow"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/600x400?text=BuildHolding";
                }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="section-title mb-4" style={{color: '#212529 !important'}}>
                {pageContent?.about?.title?.[t('language')] || pageContent?.about?.title?.en || t('home.about.title')}
              </h2>
              <p className="mb-4" style={{color: '#495057 !important'}}>
                {pageContent?.about?.description1?.[t('language')] || pageContent?.about?.description1?.en || t('home.about.description1')}
              </p>
              <p className="mb-4" style={{color: '#495057 !important'}}>
                {pageContent?.about?.description2?.[t('language')] || pageContent?.about?.description2?.en || t('home.about.description2')}
              </p>
              <Link to="/our-holding" className="btn btn-primary" style={{backgroundColor: '#0056b3 !important', borderColor: '#0056b3 !important', color: '#ffffff !important'}}>
                {pageContent?.about?.buttonText?.[t('language')] || pageContent?.about?.buttonText?.en || t('home.about.buttonText')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="featured-projects-section py-5" style={{backgroundColor: '#ffffff !important'}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title" style={{color: '#212529 !important'}}>
              {pageContent?.featured?.title?.[t('language')] || pageContent?.featured?.title?.en || t('home.featured.title')}
            </h2>
            <p className="section-subtitle" style={{color: '#6c757d !important'}}>
              {pageContent?.featured?.subtitle?.[t('language')] || pageContent?.featured?.subtitle?.en || t('home.featured.subtitle')}
            </p>
          </div>
          
          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-12">
                <div className="alert alert-danger">
                  An error occurred while loading projects. Please try again.
                </div>
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="col-12 text-center">
                <p className="text-muted">No featured projects found.</p>
              </div>
            ) : (
              <>
                {featuredProjects.slice(0, 4).map((project) => (
                  <FeaturedProject key={project.id} project={project} />
                ))}
              </>
            )}
          </div>
          
          <div className="text-center mt-4">
            <Link 
              to="/projects" 
              className="btn btn-outline-primary" 
              style={{
                borderColor: '#0056b3 !important', 
                color: '#0056b3 !important', 
                backgroundColor: '#ffffff !important',
                borderWidth: '2px'
              }}
            >
              {pageContent?.featured?.viewAll?.[t('language')] || pageContent?.featured?.viewAll?.en || t('home.featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="services-section py-5 bg-light" style={{backgroundColor: '#f8f9fa !important'}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title" style={{color: '#212529 !important'}}>
              {pageContent?.services?.title?.[t('language')] || pageContent?.services?.title?.en || t('home.services.title')}
            </h2>
            <p className="section-subtitle" style={{color: '#6c757d !important'}}>
              {pageContent?.services?.subtitle?.[t('language')] || pageContent?.services?.subtitle?.en || t('home.services.subtitle')}
            </p>
          </div>
          
          <div className="row">
            {/* Commercial Construction */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className={pageContent?.services?.commercial?.icon || "fas fa-building"} style={{color: '#0056b3', fontSize: '3rem'}}></i>
                  </div>
                  <h4 className="card-title" style={{color: '#212529 !important'}}>
                    {pageContent?.services?.commercial?.title?.[t('language')] || pageContent?.services?.commercial?.title?.en || t('home.services.commercial.title')}
                  </h4>
                  <p className="card-text" style={{color: '#6c757d !important'}}>
                    {pageContent?.services?.commercial?.description?.[t('language')] || pageContent?.services?.commercial?.description?.en || t('home.services.commercial.description')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Residential Development */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className={pageContent?.services?.residential?.icon || "fas fa-home"} style={{color: '#0056b3', fontSize: '3rem'}}></i>
                  </div>
                  <h4 className="card-title" style={{color: '#212529 !important'}}>
                    {pageContent?.services?.residential?.title?.[t('language')] || pageContent?.services?.residential?.title?.en || t('home.services.residential.title')}
                  </h4>
                  <p className="card-text" style={{color: '#6c757d !important'}}>
                    {pageContent?.services?.residential?.description?.[t('language')] || pageContent?.services?.residential?.description?.en || t('home.services.residential.description')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Renovation */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className={pageContent?.services?.renovation?.icon || "fas fa-tools"} style={{color: '#0056b3', fontSize: '3rem'}}></i>
                  </div>
                  <h4 className="card-title" style={{color: '#212529 !important'}}>
                    {pageContent?.services?.renovation?.title?.[t('language')] || pageContent?.services?.renovation?.title?.en || t('home.services.renovation.title')}
                  </h4>
                  <p className="card-text" style={{color: '#6c757d !important'}}>
                    {pageContent?.services?.renovation?.description?.[t('language')] || pageContent?.services?.renovation?.description?.en || t('home.services.renovation.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white" style={{backgroundColor: '#0056b3 !important'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="mb-3" style={{color: '#ffffff !important'}}>
                {pageContent?.cta?.title?.[t('language')] || pageContent?.cta?.title?.en || t('home.cta.title')}
              </h2>
              <p className="mb-4" style={{color: '#f8f9fa !important'}}>
                {pageContent?.cta?.subtitle?.[t('language')] || pageContent?.cta?.subtitle?.en || t('home.cta.subtitle')}
              </p>
              <Link to="/contact" className="btn btn-lg btn-light" style={{backgroundColor: '#ffffff !important', color: '#0056b3 !important'}}>
                {pageContent?.cta?.buttonText?.[t('language')] || pageContent?.cta?.buttonText?.en || t('home.cta.buttonText')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
