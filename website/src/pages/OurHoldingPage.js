import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import { getHoldingContent } from '../firebase/contentService';

const OurHoldingPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mission');
  const [activeQualification, setActiveQualification] = useState('iso9001');
  const [animateTimeline, setAnimateTimeline] = useState(false);
  const timelineRef = useRef(null);
  const [pageContent, setPageContent] = useState(null);
  
  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await getHoldingContent();
        setPageContent(content);
        console.log("Holding page content loaded from Firebase:", content);
      } catch (err) {
        console.error("Error loading holding content from Firebase:", err);
        // Continue with null content and use fallbacks
      }
    };
    
    loadContent();
  }, []);

  // Get translated content with fallback
  const getTranslatedContent = (section, field, defaultValue = '') => {
    if (!pageContent || !pageContent[section] || !pageContent[section][field]) {
      return defaultValue;
    }
    
    const fieldData = pageContent[section][field];
    
    // Check if the field is an object with language keys
    if (fieldData && typeof fieldData === 'object' && (fieldData.en || fieldData.bg || fieldData.ru)) {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      return fieldData[lang] || fieldData.en || defaultValue;
    }
    
    // If it's just a string
    return fieldData || defaultValue;
  };
  
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
  const milestones = pageContent?.history?.milestones?.map(milestone => ({
    ...milestone,
    title: milestone.title?.[t('language')] || milestone.title?.en || milestone.title || "Milestone",
    description: milestone.description?.[t('language')] || milestone.description?.en || milestone.description || "Description"
  })) || [
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
        title={getTranslatedContent('hero', 'title', t('ourHolding.hero.title'))}
        subtitle={getTranslatedContent('hero', 'subtitle', t('ourHolding.hero.subtitle'))}
        backgroundImage={pageContent?.hero?.backgroundImage || "https://picsum.photos/seed/ourholding/1200/600"}
        height="50vh"
        overlayOpacity={0.7}
      />
      
      <div className="container py-5">
        {/* Company Overview Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title mb-4" style={{color: '#212529 !important'}}>
              {getTranslatedContent('overview', 'title', t('ourHolding.overview.title'))}
            </h2>
            <p className="lead" style={{color: '#495057 !important'}}>
              {getTranslatedContent('overview', 'description', t('ourHolding.overview.description'))}
            </p>
          </div>
        </div>
        
        {/* Company Values Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="section-title" style={{color: '#212529'}}>
              {getTranslatedContent('values', 'title', t('ourHolding.values.title'))}
            </h2>
          </div>
          
          <div className="row justify-content-center">
            {pageContent?.values?.items && pageContent.values.items.length > 0 ? (
              // Render values from Firebase data
              pageContent.values.items.map((value, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff'}}>
                    <div className="card-body text-center p-4">
                      <div className="value-icon mb-3">
                        <i className={value.icon || "fas fa-star"} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                      </div>
                      <h4 className="value-title" style={{color: '#212529'}}>
                        {value.title?.[t('language')] || value.title?.en || `Value ${index + 1}`}
                      </h4>
                      <p className="card-text" style={{color: '#6c757d'}}>
                        {value.description?.[t('language')] || value.description?.en || "Description not available"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Render existing UI for backward compatibility
              [
                { id: 'integrity', icon: 'fas fa-handshake', title: t('ourHolding.values.integrity'), description: t('ourHolding.values.integrityDesc') },
                { id: 'quality', icon: 'fas fa-award', title: t('ourHolding.values.quality'), description: t('ourHolding.values.qualityDesc') },
                { id: 'innovation', icon: 'fas fa-lightbulb', title: t('ourHolding.values.innovation'), description: t('ourHolding.values.innovationDesc') },
                { id: 'sustainability', icon: 'fas fa-leaf', title: t('ourHolding.values.sustainability'), description: t('ourHolding.values.sustainabilityDesc') }
              ].map((value, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card h-100 border border-secondary" style={{backgroundColor: '#ffffff'}}>
                    <div className="card-body text-center p-4">
                      <div className="value-icon mb-3">
                        <i className={value.icon} style={{color: '#0056b3', fontSize: '2.5rem'}}></i>
                      </div>
                      <h4 className="value-title" style={{color: '#212529'}}>
                        {value.title}
                      </h4>
                      <p className="card-text" style={{color: '#6c757d'}}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
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
            <div className="row">
              <div className="col-lg-10 col-xl-8 mx-auto p-4 bg-light rounded shadow-sm">
                <h2 className="mission-title">
                  {pageContent?.tabs?.mission?.title?.[t('language')] || 
                   pageContent?.tabs?.mission?.title?.en || 
                   t('ourHolding.tabs.mission.title')}
                </h2>
                <p className="mission-content lead">
                  {pageContent?.tabs?.mission?.content?.[t('language')] || 
                   pageContent?.tabs?.mission?.content?.en || 
                   t('ourHolding.tabs.mission.content')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Who We Are Tab - Text and Image */}
          <div 
            className={`tab-pane fade ${activeTab === 'who' ? 'show active' : ''}`} 
            id="who" 
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-6 mb-4">
                <h2>
                  {pageContent?.tabs?.who?.title?.[t('language')] || 
                   pageContent?.tabs?.who?.title?.en || 
                   t('ourHolding.tabs.who.title')}
                </h2>
                <p className="lead">
                  {pageContent?.tabs?.who?.content?.[t('language')] || 
                   pageContent?.tabs?.who?.content?.en || 
                   t('ourHolding.tabs.who.content')}
                </p>
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
            <div className="row">
              <div className="col-md-6 mb-4">
                <h2>
                  {pageContent?.tabs?.team?.title?.[t('language')] || 
                   pageContent?.tabs?.team?.title?.en || 
                   t('ourHolding.tabs.team.title')}
                </h2>
                <p className="lead">
                  {pageContent?.tabs?.team?.content?.[t('language')] || 
                   pageContent?.tabs?.team?.content?.en || 
                   t('ourHolding.tabs.team.content')}
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <img 
                  src="https://picsum.photos/seed/ourteam/600/400" 
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
            <div className="row mb-4">
              <div className="col-12">
                <h2>{getTranslatedContent('equipment', 'title', t('ourHolding.tabs.equipment.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('equipment', 'description', t('ourHolding.tabs.equipment.content'))}</p>
              </div>
            </div>
            
            <div className="row equipment-grid">
              {equipmentItems.map(item => (
                <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
                  <div className="equipment-card card border-0 shadow-sm h-100">
                    <img 
                      src={item.image} 
                      className="card-img-top" 
                      alt={typeof item.name === 'object' ? (item.name[t('language')] || item.name.en || item.id) : item.name}
                      style={{height: '200px', objectFit: 'cover'}}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=Equipment";
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {typeof item.name === 'object' ? (item.name[t('language')] || item.name.en || item.id) : item.name}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quality Standards Tab - Accordion */}
          <div 
            className={`tab-pane fade ${activeTab === 'quality' ? 'show active' : ''}`} 
            id="quality" 
            role="tabpanel"
          >
            <div className="row mb-4">
              <div className="col-12">
                <h2>{getTranslatedContent('quality', 'title', t('ourHolding.tabs.quality.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('quality', 'description', t('ourHolding.tabs.quality.content'))}</p>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-4">
                <ul className="nav flex-column nav-tabs certifications-tabs" role="tablist">
                  {qualifications.map(cert => (
                    <li className="nav-item" key={cert.id}>
                      <button 
                        className={`nav-link ${activeQualification === cert.id ? 'active' : ''}`} 
                        onClick={() => setActiveQualification(cert.id)}
                        role="tab"
                      >
                        {typeof cert.name === 'object' ? (cert.name[t('language')] || cert.name.en || cert.id) : cert.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-8 mb-4">
                <div className="tab-content certification-content">
                  {qualifications.map(cert => (
                    <div 
                      key={cert.id}
                      className={`tab-pane fade ${activeQualification === cert.id ? 'show active' : ''}`}
                      role="tabpanel"
                    >
                      <div className="card">
                        <img 
                          src={cert.certificate} 
                          className="card-img-top" 
                          alt={typeof cert.name === 'object' ? (cert.name[t('language')] || cert.name.en || cert.id) : cert.name}
                          style={{height: '300px', objectFit: 'cover'}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/800x600?text=Certificate";
                          }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            {typeof cert.name === 'object' ? (cert.name[t('language')] || cert.name.en || cert.id) : cert.name}
                          </h5>
                          <p className="card-text">
                            {typeof cert.description === 'object' ? 
                              (cert.description[t('language')] || cert.description.en || t('ourHolding.quality.standardDescription')) : 
                              (cert.description || t('ourHolding.quality.standardDescription'))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
            <div className="row mb-4">
              <div className="col-12">
                <h2>{getTranslatedContent('timeline', 'title', t('ourHolding.tabs.timeline.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('timeline', 'description', t('ourHolding.tabs.timeline.content'))}</p>
              </div>
            </div>
            
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div className={`timeline-item ${index % 2 ? 'right' : 'left'}`} key={index}>
                  <div className="timeline-badge" style={{ backgroundColor: milestone.bgColor || '#0056b3' }}>
                    <i className={`fas ${milestone.icon || 'fa-building'}`}></i>
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">{milestone.title}</h4>
                      <p><small className="text-muted"><i className="fas fa-calendar-alt mr-1"></i> {milestone.year}</small></p>
                    </div>
                    <div className="timeline-body">
                      <p>{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Partners Tab - Card Grid */}
          <div 
            className={`tab-pane fade ${activeTab === 'partners' ? 'show active' : ''}`} 
            id="partners" 
            role="tabpanel"
          >
            <div className="row mb-4">
              <div className="col-12">
                <h2>{getTranslatedContent('partners', 'title', t('ourHolding.tabs.partners.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('partners', 'description', t('ourHolding.tabs.partners.content'))}</p>
              </div>
            </div>
            
            <div className="row">
              {partners.map(partner => (
                <div className="col-md-4 col-lg-3 mb-4" key={partner.id}>
                  <div className="card partner-card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <img 
                        src={partner.logo} 
                        alt={typeof partner.name === 'object' ? 
                          (partner.name[t('language')] || partner.name.en || 'Partner') : 
                          (partner.name || 'Partner')}
                        className="img-fluid partner-logo mb-3"
                        style={{maxHeight: '80px'}}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150x80?text=Partner";
                        }}
                      />
                      <h5 className="card-title">
                        {typeof partner.name === 'object' ? 
                          (partner.name[t('language')] || partner.name.en || 'Partner') : 
                          (partner.name || 'Partner')}
                      </h5>
                      {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary mt-2">
                          {t('common.visitWebsite')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Clients Tab - Grid View */}
          <div 
            className={`tab-pane fade ${activeTab === 'clients' ? 'show active' : ''}`} 
            id="clients" 
            role="tabpanel"
          >
            <div className="row mb-4">
              <div className="col-12">
                <h2>{getTranslatedContent('clients', 'title', t('ourHolding.tabs.clients.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('clients', 'description', t('ourHolding.tabs.clients.content'))}</p>
              </div>
            </div>
            
            <div className="row">
              {clients.map(client => (
                <div className="col-md-3 col-lg-2 mb-4" key={client.id}>
                  <div className="client-card card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-3">
                      <img 
                        src={client.logo} 
                        alt={typeof client.name === 'object' ? 
                          (client.name[t('language')] || client.name.en || 'Client') : 
                          (client.name || 'Client')} 
                        className="img-fluid client-logo"
                        style={{maxHeight: '60px'}}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/120x60?text=Client";
                        }}
                      />
                      
                      <p className="client-name small mt-2 mb-0">
                        {typeof client.name === 'object' ? 
                          (client.name[t('language')] || client.name.en || 'Client') : 
                          (client.name || 'Client')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurHoldingPage;
