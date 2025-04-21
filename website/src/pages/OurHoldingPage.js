import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import * as holdingContentService from '../services/holdingContentService';

const OurHoldingPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mission');
  const [activeQualification, setActiveQualification] = useState('iso9001');
  const [animateTimeline, setAnimateTimeline] = useState(false);
  const timelineRef = useRef(null);
  const [pageContent, setPageContent] = useState(null);
  
  // Load content from holdingContentService
  useEffect(() => {
    const content = holdingContentService.getHoldingContent();
    setPageContent(content);
  }, []);
  
  // Equipment items - use content from service if available, otherwise fall back to hardcoded data
  const equipmentItems = Array.isArray(pageContent?.equipment) ? pageContent.equipment : [
    { id: 'crane1', name: 'Tower Crane', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 'excavator1', name: 'Excavator', image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 'bulldozer1', name: 'Bulldozer', image: 'https://images.unsplash.com/photo-1594412475796-20b69b6c5161?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 'concrete1', name: 'Concrete Mixer', image: 'https://images.unsplash.com/photo-1617417367206-5f497d11fd26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 'loader1', name: 'Front Loader', image: 'https://images.unsplash.com/photo-1574789898709-42abaecf4ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 'forklift1', name: 'Forklift', image: 'https://images.unsplash.com/photo-1578086623300-69aeb53e83f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' }
  ];
  
  // Quality standards certifications - use content from service if available
  const qualifications = Array.isArray(pageContent?.qualifications) ? pageContent.qualifications : [
    { id: 'iso9001', name: 'ISO 9001:2015', certificate: 'https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80' },
    { id: 'iso14001', name: 'ISO 14001:2015', certificate: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80' },
    { id: 'ohsas18001', name: 'OHSAS 18001', certificate: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80' },
    { id: 'leed', name: 'LEED Certification', certificate: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80' }
  ];
  
  // Timeline milestones - use content from service if available
  const milestones = Array.isArray(pageContent?.milestones) ? pageContent.milestones : [
    { 
      year: "1995", 
      title: "Company Founded", 
      description: "Started as a small residential contractor in Sofia with just 5 employees.",
      icon: "fa-building",
      bgColor: "#0056b3"
    },
    { 
      year: "2005", 
      title: "Commercial Expansion", 
      description: "Secured our first major commercial contracts throughout Bulgaria.",
      icon: "fa-city",
      bgColor: "#ff7722"
    },
    { 
      year: "2010", 
      title: "International Projects", 
      description: "Expanded operations to Romania, Serbia and Greece.",
      icon: "fa-globe-europe",
      bgColor: "#28a745"
    },
    { 
      year: "2020", 
      title: "Holding Formation", 
      description: "Reorganized as BuildHolding with multiple specialized subsidiaries.",
      icon: "fa-sitemap",
      bgColor: "#6610f2"
    }
  ];
  
  // Partners for the info cards
  const partners = Array.isArray(pageContent?.partners) ? pageContent.partners : [
    { 
      id: 'partner1', 
      name: 'Construct Co.', 
      logo: 'https://via.placeholder.com/150?text=Construct', 
      type: 'Material Supplier',
      description: 'Premier supplier of concrete and steel materials for all our major projects.',
      year: '2005'
    },
    { 
      id: 'partner2', 
      name: 'Tech Solutions', 
      logo: 'https://via.placeholder.com/150?text=TechSol', 
      type: 'Technology Provider',
      description: 'Innovative construction technology solutions for smart buildings.',
      year: '2012'
    },
    { 
      id: 'partner3', 
      name: 'BuildTech Inc.', 
      logo: 'https://via.placeholder.com/150?text=BuildTech', 
      type: 'Equipment Provider',
      description: 'Specialized construction equipment for complex building requirements.',
      year: '2008'
    },
    { 
      id: 'partner4', 
      name: 'Sofia Cement', 
      logo: 'https://via.placeholder.com/150?text=SofiaCement', 
      type: 'Material Supplier',
      description: 'Local supplier of high-quality cement and concrete mixes.',
      year: '2001'
    }
  ];
  
  // Clients for the info cards
  const clients = Array.isArray(pageContent?.clients) ? pageContent.clients : [
    { 
      id: 'client1', 
      name: 'Sofia Municipality', 
      logo: 'https://via.placeholder.com/150?text=SofiaMunicipality', 
      type: 'Government',
      projects: 15,
      highlight: 'Sofia Central Square Renovation'
    },
    { 
      id: 'client2', 
      name: 'EuroCorp', 
      logo: 'https://via.placeholder.com/150?text=EuroCorp', 
      type: 'Corporate',
      projects: 8,
      highlight: 'EuroCorp Headquarters'
    },
    { 
      id: 'client3', 
      name: 'Global Retail', 
      logo: 'https://via.placeholder.com/150?text=GlobalRetail', 
      type: 'Retail',
      projects: 12,
      highlight: 'Paradise Mall Construction'
    },
    { 
      id: 'client4', 
      name: 'East European Bank', 
      logo: 'https://via.placeholder.com/150?text=EEBank', 
      type: 'Financial',
      projects: 6,
      highlight: 'EEB Tower'
    }
  ];

  useEffect(() => {
    // Handle timeline animation
    if (activeTab === 'timeline' && timelineRef.current) {
      const timer = setTimeout(() => {
        setAnimateTimeline(true);
      }, 300);
      
      // Create an observer for timeline visibility
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setAnimateTimeline(true);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(timelineRef.current);
      
      return () => {
        clearTimeout(timer);
        if (timelineRef.current) {
          observer.unobserve(timelineRef.current);
        }
        setAnimateTimeline(false);
      };
    }
  }, [activeTab, timelineRef]);
  
  // Timeline Marker Component
  const TimelineMarker = ({ icon, bgColor }) => (
    <div 
      className="timeline-marker"
      style={{ backgroundColor: '#fff', borderColor: bgColor }}
    >
      <div className="timeline-icon">
        <i className={`fas ${icon}`} style={{ color: bgColor }}></i>
      </div>
    </div>
  );
  
  // Timeline Content Component
  const TimelineContent = ({ position, year, title, description }) => (
    <div className={`timeline-content ${position}`}>
      <div className="year-badge">{year}</div>
      <div className="milestone-card">
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
  
  return (
    <div className="our-holding-page">
      <HeroSection 
        title={pageContent?.hero?.title?.[t('language')] || pageContent?.hero?.title?.en || t('ourHolding.hero.title')}
        subtitle={pageContent?.hero?.subtitle?.[t('language')] || pageContent?.hero?.subtitle?.en || t('ourHolding.hero.subtitle')}
        backgroundImage={pageContent?.hero?.backgroundImage || "https://picsum.photos/seed/ourholding/1200/600"}
        height="50vh"
        overlayOpacity={0.7}
      />
      
      <div className="container py-5">
        {/* Company Overview Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title mb-4" style={{color: '#212529 !important'}}>
              {pageContent?.overview?.title?.[t('language')] || pageContent?.overview?.title?.en || t('ourHolding.overview.title')}
            </h2>
            <p className="lead" style={{color: '#495057 !important'}}>
              {pageContent?.overview?.description?.[t('language')] || pageContent?.overview?.description?.en || t('ourHolding.overview.description')}
            </p>
          </div>
        </div>
        
        {/* Company Values Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="section-title" style={{color: '#212529 !important'}}>
              {pageContent?.values?.title?.[t('language')] || pageContent?.values?.title?.en || t('ourHolding.values.title')}
            </h2>
          </div>
          
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
              <div className="card-body text-center p-4">
                <div className="value-icon mb-3">
                  <i className={pageContent?.values?.integrity?.icon || "fas fa-handshake"} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                </div>
                <h4 className="value-title" style={{color: '#212529 !important'}}>
                  {pageContent?.values?.integrity?.title?.[t('language')] || pageContent?.values?.integrity?.title?.en || t('ourHolding.values.integrity')}
                </h4>
                <p className="card-text" style={{color: '#6c757d !important'}}>
                  {pageContent?.values?.integrity?.description?.[t('language')] || pageContent?.values?.integrity?.description?.en || t('ourHolding.values.integrityDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
              <div className="card-body text-center p-4">
                <div className="value-icon mb-3">
                  <i className={pageContent?.values?.quality?.icon || "fas fa-award"} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                </div>
                <h4 className="value-title" style={{color: '#212529 !important'}}>
                  {pageContent?.values?.quality?.title?.[t('language')] || pageContent?.values?.quality?.title?.en || t('ourHolding.values.quality')}
                </h4>
                <p className="card-text" style={{color: '#6c757d !important'}}>
                  {pageContent?.values?.quality?.description?.[t('language')] || pageContent?.values?.quality?.description?.en || t('ourHolding.values.qualityDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
              <div className="card-body text-center p-4">
                <div className="value-icon mb-3">
                  <i className={pageContent?.values?.innovation?.icon || "fas fa-lightbulb"} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                </div>
                <h4 className="value-title" style={{color: '#212529 !important'}}>
                  {pageContent?.values?.innovation?.title?.[t('language')] || pageContent?.values?.innovation?.title?.en || t('ourHolding.values.innovation')}
                </h4>
                <p className="card-text" style={{color: '#6c757d !important'}}>
                  {pageContent?.values?.innovation?.description?.[t('language')] || pageContent?.values?.innovation?.description?.en || t('ourHolding.values.innovationDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff !important'}}>
              <div className="card-body text-center p-4">
                <div className="value-icon mb-3">
                  <i className={pageContent?.values?.sustainability?.icon || "fas fa-leaf"} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                </div>
                <h4 className="value-title" style={{color: '#212529 !important'}}>
                  {pageContent?.values?.sustainability?.title?.[t('language')] || pageContent?.values?.sustainability?.title?.en || t('ourHolding.values.sustainability')}
                </h4>
                <p className="card-text" style={{color: '#6c757d !important'}}>
                  {pageContent?.values?.sustainability?.description?.[t('language')] || pageContent?.values?.sustainability?.description?.en || t('ourHolding.values.sustainabilityDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="row mb-3">
          <div className="col-12">
            <ul className="nav nav-tabs" id="holdingTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'mission' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mission')}
                  id="mission-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'mission'}
                >
                  {t('ourHolding.tabs.mission.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'who' ? 'active' : ''}`}
                  onClick={() => setActiveTab('who')}
                  id="who-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'who'}
                >
                  {t('ourHolding.tabs.who.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => setActiveTab('team')}
                  id="team-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'team'}
                >
                  {t('ourHolding.tabs.team.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'equipment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('equipment')}
                  id="equipment-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'equipment'}
                >
                  {t('ourHolding.tabs.equipment.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'quality' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quality')}
                  id="quality-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'quality'}
                >
                  {t('ourHolding.tabs.quality.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                  id="timeline-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'timeline'}
                >
                  {t('ourHolding.tabs.timeline.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'partners' ? 'active' : ''}`}
                  onClick={() => setActiveTab('partners')}
                  id="partners-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'partners'}
                >
                  {t('ourHolding.tabs.partners.title')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
                  onClick={() => setActiveTab('clients')}
                  id="clients-tab"
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'clients'}
                >
                  {t('ourHolding.tabs.clients.title')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Tabs Content */}
        <div className="tab-content" id="holdingTabContent">
          {/* Mission Tab - Text Only */}
          <div 
            className={`tab-pane fade ${activeTab === 'mission' ? 'show active' : ''}`} 
            id="mission" 
            role="tabpanel"
          >
            <div className="row" data-aos="fade-up">
              <div className="col-lg-10 col-xl-8 mx-auto p-4 bg-light rounded shadow-sm">
                <h2 className="mission-title">{t('ourHolding.tabs.mission.title')}</h2>
                <p className="mission-content lead">{t('ourHolding.tabs.mission.content')}</p>
              </div>
            </div>
          </div>
          
          {/* Who We Are Tab - Text and Image */}
          <div 
            className={`tab-pane fade ${activeTab === 'who' ? 'show active' : ''}`} 
            id="who" 
            role="tabpanel"
          >
            <div className="row" data-aos="fade-up">
              <div className="col-md-6 mb-4">
                <h2>{t('ourHolding.tabs.who.title')}</h2>
                <p className="lead">{t('ourHolding.tabs.who.content')}</p>
              </div>
              <div className="col-md-6 mb-4">
                <img 
                  src="https://picsum.photos/seed/whoweare/600/400" 
                  alt={t('ourHolding.tabs.who.title')} 
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
          
          {/* Our Team Tab - Text and Image */}
          <div 
            className={`tab-pane fade ${activeTab === 'team' ? 'show active' : ''}`} 
            id="team" 
            role="tabpanel"
          >
            <div className="row" data-aos="fade-up">
              <div className="col-md-6 mb-4">
                <h2>{t('ourHolding.tabs.team.title')}</h2>
                <p className="lead">{t('ourHolding.tabs.team.content')}</p>
              </div>
              <div className="col-md-6 mb-4">
                <img 
                  src="https://picsum.photos/seed/team/600/400" 
                  alt={t('ourHolding.tabs.team.title')} 
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
          
          {/* Equipment Tab - Grid View */}
          <div 
            className={`tab-pane fade ${activeTab === 'equipment' ? 'show active' : ''}`} 
            id="equipment" 
            role="tabpanel"
          >
            <div className="row mb-4" data-aos="fade-up">
              <div className="col-12">
                <h2>{t('ourHolding.tabs.equipment.title')}</h2>
                <p className="lead mb-4">{t('ourHolding.tabs.equipment.content')}</p>
              </div>
            </div>
            
            <div className="row equipment-grid">
              {equipmentItems.map(item => (
                <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
                  <div className="equipment-card card border-0 shadow-sm h-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="card-img-top equipment-image"
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{item.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quality Standards Tab - Selector and Certificate Display */}
          <div 
            className={`tab-pane fade ${activeTab === 'quality' ? 'show active' : ''}`} 
            id="quality" 
            role="tabpanel"
          >
            <div className="row" data-aos="fade-up">
              <div className="col-lg-4 mb-4">
                <h2>{t('ourHolding.tabs.quality.title')}</h2>
                <p className="lead mb-4">{t('ourHolding.tabs.quality.content')}</p>
                
                <div className="list-group quality-selector">
                  {qualifications.map(qual => (
                    <button
                      key={qual.id}
                      className={`list-group-item list-group-item-action ${activeQualification === qual.id ? 'active' : ''}`}
                      onClick={() => setActiveQualification(qual.id)}
                    >
                      {qual.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="certificate-display p-3 bg-light rounded shadow-sm">
                  <h4 className="mb-3">{qualifications.find(q => q.id === activeQualification)?.name}</h4>
                  <div className="certificate-image-container">
                    <img 
                      src={qualifications.find(q => q.id === activeQualification)?.certificate} 
                      alt={`${qualifications.find(q => q.id === activeQualification)?.name} Certificate`}
                      className="img-fluid rounded certificate-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline Tab - Vertical Timeline */}
          <div 
            className={`tab-pane fade ${activeTab === 'timeline' ? 'show active' : ''}`} 
            id="timeline" 
            role="tabpanel"
          >
            <div className="row mb-4" data-aos="fade-up">
              <div className="col-12 text-center">
                <h2 className="display-4 timeline-heading">{t('ourHolding.tabs.timeline.title')}</h2>
                <p className="lead mb-5">{t('ourHolding.tabs.timeline.content')}</p>
              </div>
            </div>
            
            <div className="vertical-timeline-container" ref={timelineRef}>
              <div className="timeline-line"></div>
              
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`timeline-event ${animateTimeline ? 'animated' : ''}`}
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                  data-aos-delay={index * 100}
                >
                  <TimelineMarker icon={milestone.icon} bgColor={milestone.bgColor} />
                  <TimelineContent 
                    position={index % 2 === 0 ? 'left' : 'right'} 
                    year={milestone.year}
                    title={milestone.title}
                    description={milestone.description}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Partners Tab - Interactive Partner Cards */}
          <div 
            className={`tab-pane fade ${activeTab === 'partners' ? 'show active' : ''}`} 
            id="partners" 
            role="tabpanel"
          >
            <div className="row mb-5" data-aos="fade-up">
              <div className="col-12 text-center">
                <h2 className="display-4 mb-3">{t('ourHolding.tabs.partners.title')}</h2>
                <p className="lead mb-5">{t('ourHolding.tabs.partners.content')}</p>
              </div>
            </div>
            
            <div className="partners-container">
              <div className="row partners-showcase">
                {partners.map((partner, index) => (
                  <div className="col-md-6 col-lg-3 mb-4" key={partner.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="partner-card">
                      <div className="partner-card-inner">
                        <div className="partner-card-front">
                          <div className="logo-container mb-3">
                            <img src={partner.logo} alt={partner.name} className="partner-logo" />
                          </div>
                          <h4 className="partner-name">{partner.name}</h4>
                          <span className="partner-type badge bg-primary">{partner.type}</span>
                        </div>
                        <div className="partner-card-back">
                          <div className="partner-details">
                            <h5>{partner.name}</h5>
                            <p className="partnership-year">
                              <i className="fas fa-handshake me-2"></i>
                              Partner since {partner.year}
                            </p>
                            <p className="partner-description">{partner.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Clients Tab - Using same flip card format as partners */}
          <div 
            className={`tab-pane fade ${activeTab === 'clients' ? 'show active' : ''}`} 
            id="clients" 
            role="tabpanel"
          >
            <div className="row mb-5" data-aos="fade-up">
              <div className="col-12 text-center">
                <h2 className="display-4 mb-3">{t('ourHolding.tabs.clients.title')}</h2>
                <p className="lead mb-5">{t('ourHolding.tabs.clients.content')}</p>
              </div>
            </div>
            
            <div className="clients-container">
              <div className="row clients-showcase">
                {clients.map((client, index) => (
                  <div className="col-md-6 col-lg-3 mb-4" key={client.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="client-card">
                      <div className="client-card-inner">
                        <div className="client-card-front">
                          <div className="logo-container mb-3">
                            <img src={client.logo} alt={client.name} className="client-logo" />
                          </div>
                          <h4 className="client-name">{client.name}</h4>
                          <span className="client-type badge bg-secondary">{client.type}</span>
                        </div>
                        <div className="client-card-back">
                          <div className="client-details">
                            <h5>{client.name}</h5>
                            <div className="client-projects-count">
                              <span className="projects-number">{client.projects}</span>
                              <span className="projects-label">Projects Completed</span>
                            </div>
                            <p className="client-highlight">
                              <i className="fas fa-star me-2"></i>
                              {client.highlight}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurHoldingPage;
