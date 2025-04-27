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
  
  // Custom CSS for card flip effect
  useEffect(() => {
    // Add CSS for card-flip effect
    const style = document.createElement('style');
    style.textContent = `
      .card-flip {
        perspective: 1000px;
        height: 100%;
        cursor: pointer;
      }
      .card-flip-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
      }
      .card-flip:hover .card-flip-inner {
        transform: rotateY(180deg);
      }
      .card-flip-front, .card-flip-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        border-radius: 4px;
      }
      .card-flip-front {
        background-color: white;
        z-index: 2;
      }
      .card-flip-back {
        transform: rotateY(180deg);
      }
      .equipment-card, .partner-card, .client-card {
        height: 100%;
        transition: transform 0.3s;
      }
      .equipment-card:hover, .partner-card:hover, .client-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      
      /* Timeline styles */
      .timeline {
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
      }
      .timeline::after {
        content: '';
        position: absolute;
        width: 6px;
        background-color: #e9ecef;
        top: 0;
        bottom: 0;
        left: 50%;
        margin-left: -3px;
      }
      .timeline-item {
        padding: 10px 40px;
        position: relative;
        width: 50%;
        box-sizing: border-box;
      }
      .timeline-item::after {
        content: '';
        position: absolute;
        width: 25px;
        height: 25px;
        background-color: white;
        border: 4px solid #0056b3;
        top: 18px;
        border-radius: 50%;
        z-index: 1;
      }
      .left {
        left: 0;
      }
      .right {
        left: 50%;
      }
      .left::after {
        right: -12px;
      }
      .right::after {
        left: -12px;
      }
      .timeline-badge {
        position: absolute;
        top: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: 2;
        color: white;
        text-align: center;
        line-height: 32px;
      }
      .left .timeline-badge {
        right: 32px;
      }
      .right .timeline-badge {
        left: 32px;
      }
      .timeline-panel {
        padding: 20px;
        background-color: white;
        position: relative;
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
      }
      
      /* Certificate styles */
      .quality-selector .list-group-item.active {
        background-color: #0056b3;
        border-color: #0056b3;
      }
      .certificate-display {
        min-height: 500px;
      }
      .certificate-image-container {
        text-align: center;
        margin: 20px 0;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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
    { 
      id: 'crane1', 
      name: { en: 'Tower Crane', bg: 'Кула кран', ru: 'Башенный кран' }, 
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      description: { en: 'Used for high-rise construction', bg: 'Използва се за високо строителство', ru: 'Используется для высотного строительства' }
    },
    { 
      id: 'excavator1', 
      name: { en: 'Excavator', bg: 'Багер', ru: 'Экскаватор' }, 
      image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      description: { en: 'Heavy equipment for digging and material handling', bg: 'Тежко оборудване за копаене и обработка на материали', ru: 'Тяжелое оборудование для рытья и обработки материалов' }
    },
    { 
      id: 'bulldozer1', 
      name: { en: 'Bulldozer', bg: 'Булдозер', ru: 'Бульдозер' }, 
      image: 'https://images.unsplash.com/photo-1578091437495-6c7966a9a0be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      description: { en: 'Earthmoving equipment for various construction tasks', bg: 'Земекопно оборудване за различни строителни задачи', ru: 'Землеройное оборудование для различных строительных задач' }
    },
    { 
      id: 'concretetruck1', 
      name: { en: 'Concrete Mixer Truck', bg: 'Бетоновоз', ru: 'Бетономешалка' }, 
      image: 'https://images.unsplash.com/photo-1626372970029-1cd0ccc1bec8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      description: { en: 'Transports concrete mix to construction sites', bg: 'Транспортира бетонова смес до строителни обекти', ru: 'Транспортирует бетонную смесь на строительные площадки' }
    }
  ];
  
  // Quality standards certifications - use content from service if available
  const qualifications = Array.isArray(pageContent?.qualifications) ? pageContent.qualifications : [
    { 
      id: 'iso9001', 
      name: { en: 'ISO 9001', bg: 'ISO 9001', ru: 'ISO 9001' }, 
      certificate: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', 
      description: { 
        en: 'Quality Management System - ensures that our products and services consistently meet customer requirements and quality is continuously improved.', 
        bg: 'Система за управление на качеството - гарантира, че нашите продукти и услуги последователно отговарят на изискванията на клиентите и качеството непрекъснато се подобрява.', 
        ru: 'Система менеджмента качества - гарантирует, что наши продукты и услуги постоянно соответствуют требованиям клиентов и качество постоянно улучшается.'
      }
    },
    { 
      id: 'iso14001', 
      name: { en: 'ISO 14001', bg: 'ISO 14001', ru: 'ISO 14001' }, 
      certificate: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', 
      description: { 
        en: 'Environmental Management System - demonstrates our commitment to reducing environmental impact and promoting sustainability.',
        bg: 'Система за управление на околната среда - демонстрира нашия ангажимент за намаляване на въздействието върху околната среда и насърчаване на устойчивостта.',
        ru: 'Система экологического менеджмента - демонстрирует нашу приверженность снижению воздействия на окружающую среду и продвижению устойчивого развития.'
      }
    },
    { 
      id: 'iso45001', 
      name: { en: 'ISO 45001', bg: 'ISO 45001', ru: 'ISO 45001' }, 
      certificate: 'https://images.unsplash.com/photo-1596091954256-7f1a94bf0be8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', 
      description: { 
        en: 'Occupational Health and Safety Management System - ensures a safe and healthy workplace for all our employees and contractors.',
        bg: 'Система за управление на здравето и безопасността при работа - осигурява безопасно и здравословно работно място за всички наши служители и подизпълнители.',
        ru: 'Система менеджмента охраны здоровья и безопасности труда - обеспечивает безопасное и здоровое рабочее место для всех наших сотрудников и подрядчиков.'
      }
    },
    { 
      id: 'eurocodes', 
      name: { en: 'Eurocodes', bg: 'Еврокодове', ru: 'Еврокоды' }, 
      certificate: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', 
      description: { 
        en: 'European standards for structural design and calculation - ensures our buildings meet the highest structural safety standards.',
        bg: 'Европейски стандарти за структурно проектиране и изчисляване - гарантира, че нашите сгради отговарят на най-високите стандарти за структурна безопасност.',
        ru: 'Европейские стандарты для проектирования и расчета конструкций - гарантирует, что наши здания соответствуют самым высоким стандартам структурной безопасности.'
      }
    }
  ];
  
  // Partner companies - use content from service if available
  const partners = Array.isArray(pageContent?.partners) ? pageContent.partners : [
    { 
      id: 'partner1', 
      name: { en: 'SteelTech Industries', bg: 'SteelTech Индъстрис', ru: 'SteelTech Индастриз' }, 
      logo: 'https://via.placeholder.com/150x80?text=SteelTech', 
      description: { 
        en: 'Providing high-quality steel products and structural solutions since 1995.', 
        bg: 'Предоставя висококачествени стоманени продукти и структурни решения от 1995 г.', 
        ru: 'Поставляет высококачественные стальные изделия и конструкционные решения с 1995 года.' 
      },
      website: 'https://example.com/steeltech',
      year: '2008'
    },
    { 
      id: 'partner2', 
      name: { en: 'GlassMasters', bg: 'ГласМастърс', ru: 'ГласМастерс' }, 
      logo: 'https://via.placeholder.com/150x80?text=GlassMasters', 
      description: { 
        en: 'Leading provider of architectural glass solutions for modern buildings.', 
        bg: 'Водещ доставчик на архитектурни стъклени решения за модерни сгради.', 
        ru: 'Ведущий поставщик архитектурных стеклянных решений для современных зданий.' 
      },
      website: 'https://example.com/glassmasters',
      year: '2012'
    },
    { 
      id: 'partner3', 
      name: { en: 'EuroMaterials', bg: 'ЕвроМатериалс', ru: 'ЕвроМатериалс' }, 
      logo: 'https://via.placeholder.com/150x80?text=EuroMaterials', 
      description: { 
        en: 'European supplier of premium building materials for commercial construction.', 
        bg: 'Европейски доставчик на премиум строителни материали за търговско строителство.', 
        ru: 'Европейский поставщик первоклассных строительных материалов для коммерческого строительства.' 
      },
      website: 'https://example.com/euromaterials',
      year: '2015'
    },
    { 
      id: 'partner4', 
      name: { en: 'TechDesign Architects', bg: 'ТехДизайн Архитекти', ru: 'ТехДизайн Архитекторы' }, 
      logo: 'https://via.placeholder.com/150x80?text=TechDesign', 
      description: { 
        en: 'Award-winning architectural firm specializing in sustainable commercial designs.', 
        bg: 'Отличена архитектурна фирма, специализирана в устойчиви търговски дизайни.', 
        ru: 'Отмеченная наградами архитектурная фирма, специализирующаяся на устойчивых коммерческих проектах.' 
      },
      website: 'https://example.com/techdesign',
      year: '2018'
    }
  ];
  
  // Client companies - use content from service if available
  const clients = Array.isArray(pageContent?.clients) ? pageContent.clients : [
    { 
      id: 'client1', 
      name: { en: 'Global Banking Corp', bg: 'Глобал Банкинг Корп', ru: 'Глобал Банкинг Корп' }, 
      logo: 'https://via.placeholder.com/120x60?text=GBC', 
      type: { en: 'Financial', bg: 'Финансов', ru: 'Финансовый' },
      projects: 12,
      highlight: { 
        en: 'Built their award-winning headquarters in Sofia', 
        bg: 'Построихме тяхната централа в София, носител на награди', 
        ru: 'Построили их отмеченную наградами штаб-квартиру в Софии' 
      }
    },
    { 
      id: 'client2', 
      name: { en: 'TechNova', bg: 'ТехНова', ru: 'ТехНова' }, 
      logo: 'https://via.placeholder.com/120x60?text=TechNova', 
      type: { en: 'Technology', bg: 'Технологии', ru: 'Технологии' },
      projects: 8,
      highlight: { 
        en: 'Completed 3 innovation centers across Eastern Europe', 
        bg: 'Завършени 3 иновационни центъра в Източна Европа', 
        ru: 'Завершены 3 инновационных центра по всей Восточной Европе' 
      }
    },
    { 
      id: 'client3', 
      name: { en: 'EuroRetail Group', bg: 'ЕвроРитейл Груп', ru: 'ЕвроРитейл Груп' }, 
      logo: 'https://via.placeholder.com/120x60?text=ERG', 
      type: { en: 'Retail', bg: 'Търговия на дребно', ru: 'Розничная торговля' },
      projects: 24,
      highlight: { 
        en: 'Built 24 shopping centers in 5 countries', 
        bg: 'Построени 24 търговски центъра в 5 държави', 
        ru: 'Построены 24 торговых центра в 5 странах' 
      }
    },
    { 
      id: 'client4', 
      name: { en: 'GreenEnergy Power', bg: 'ГрийнЕнерджи Пауър', ru: 'ГринЭнерджи Пауэр' }, 
      logo: 'https://via.placeholder.com/120x60?text=GEP', 
      type: { en: 'Energy', bg: 'Енергетика', ru: 'Энергетика' },
      projects: 6,
      highlight: { 
        en: 'Constructed sustainable power plants and infrastructure', 
        bg: 'Изградени устойчиви електроцентрали и инфраструктура', 
        ru: 'Построены устойчивые электростанции и инфраструктура' 
      }
    },
    { 
      id: 'client5', 
      name: { en: 'MediCare Hospitals', bg: 'МедиКеър Хоспиталс', ru: 'МедиКэр Хоспиталс' }, 
      logo: 'https://via.placeholder.com/120x60?text=MCH', 
      type: { en: 'Healthcare', bg: 'Здравеопазване', ru: 'Здравоохранение' },
      projects: 5,
      highlight: { 
        en: 'Developed state-of-the-art medical facilities', 
        bg: 'Разработени съвременни медицински съоръжения', 
        ru: 'Разработаны современные медицинские учреждения' 
      }
    },
    { 
      id: 'client6', 
      name: { en: 'EuroGovernment', bg: 'ЕвроГавърнмънт', ru: 'ЕвроГавернмент' }, 
      logo: 'https://via.placeholder.com/120x60?text=EG', 
      type: { en: 'Government', bg: 'Правителство', ru: 'Правительство' },
      projects: 10,
      highlight: { 
        en: 'Built municipal and government buildings across the region', 
        bg: 'Построени общински и правителствени сгради в региона', 
        ru: 'Построены муниципальные и правительственные здания по всему региону' 
      }
    }
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
          
          {/* Equipment Tab - Rotating Cards */}
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
            
            <div className="row">
              {equipmentItems.map((item) => (
                <div className="col-md-6 col-lg-3 mb-4" key={item.id}>
                  <div className="card-flip">
                    <div className="card-flip-inner">
                      {/* Front of the card */}
                      <div className="card-flip-front">
                        <div className="card h-100 border-0 shadow-sm">
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
                          <div className="card-body text-center">
                            <h5 className="card-title">
                              {typeof item.name === 'object' ? (item.name[t('language')] || item.name.en || item.id) : item.name}
                            </h5>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back of the card */}
                      <div className="card-flip-back">
                        <div className="card h-100 border-0 shadow-sm bg-primary text-white">
                          <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title mb-3">
                              {typeof item.name === 'object' ? (item.name[t('language')] || item.name.en || item.id) : item.name}
                            </h5>
                            <p className="card-text">
                              {typeof item.description === 'object' ? 
                                (item.description[t('language')] || item.description.en || t('ourHolding.equipment.defaultDescription')) : 
                                (item.description || t('ourHolding.equipment.defaultDescription'))}
                            </p>
                          </div>
                        </div>
                      </div>
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
            <div className="row">
              <div className="col-lg-4 mb-4">
                <h2>{getTranslatedContent('quality', 'title', t('ourHolding.tabs.quality.title'))}</h2>
                <p className="lead mb-4">{getTranslatedContent('quality', 'description', t('ourHolding.tabs.quality.content'))}</p>
                
                <div className="list-group quality-selector">
                  {qualifications.map(qual => (
                    <button
                      key={qual.id}
                      className={`list-group-item list-group-item-action ${activeQualification === qual.id ? 'active' : ''}`}
                      onClick={() => setActiveQualification(qual.id)}
                    >
                      {typeof qual.name === 'object' ? (qual.name[t('language')] || qual.name.en || qual.id) : qual.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="certificate-display p-3 bg-light rounded shadow-sm">
                  <h4 className="mb-3">
                    {(() => {
                      const qual = qualifications.find(q => q.id === activeQualification);
                      return typeof qual?.name === 'object' 
                        ? (qual.name[t('language')] || qual.name.en || qual.id) 
                        : (qual?.name || '');
                    })()}
                  </h4>
                  <div className="certificate-image-container">
                    <img 
                      src={qualifications.find(q => q.id === activeQualification)?.certificate || ''} 
                      alt={`${(() => {
                        const qual = qualifications.find(q => q.id === activeQualification);
                        return typeof qual?.name === 'object' 
                          ? (qual.name[t('language')] || qual.name.en || qual.id) 
                          : (qual?.name || '');
                      })()} Certificate`}
                      className="img-fluid rounded certificate-image"
                      style={{maxHeight: '400px', width: 'auto'}}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x600?text=Certificate";
                      }}
                    />
                  </div>
                  <p className="mt-3">
                    {(() => {
                      const qual = qualifications.find(q => q.id === activeQualification);
                      return typeof qual?.description === 'object' 
                        ? (qual.description[t('language')] || qual.description.en || '') 
                        : (qual?.description || '');
                    })()}
                  </p>
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
            
            <div className="timeline" ref={timelineRef}>
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
          
          {/* Partners Tab - Rotating Cards */}
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
              {partners.map((partner) => (
                <div className="col-md-6 col-lg-3 mb-4" key={partner.id}>
                  <div className="card-flip">
                    <div className="card-flip-inner">
                      {/* Front of the card */}
                      <div className="card-flip-front">
                        <div className="card h-100 border-0 shadow-sm">
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
                          </div>
                        </div>
                      </div>
                      
                      {/* Back of the card */}
                      <div className="card-flip-back">
                        <div className="card h-100 border-0 shadow-sm bg-info text-white">
                          <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                              {typeof partner.name === 'object' ? 
                                (partner.name[t('language')] || partner.name.en || 'Partner') : 
                                (partner.name || 'Partner')}
                            </h5>
                            <p className="partner-year">
                              <i className="fas fa-handshake me-2"></i>
                              {t('ourHolding.partners.since')} {partner.year}
                            </p>
                            <p className="card-text">
                              {typeof partner.description === 'object' ? 
                                (partner.description[t('language')] || partner.description.en || '') : 
                                (partner.description || '')}
                            </p>
                            {partner.website && (
                              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light mt-2">
                                {t('common.visitWebsite')}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Clients Tab - Rotating Cards */}
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
              {clients.map((client) => (
                <div className="col-md-4 col-lg-3 mb-4" key={client.id}>
                  <div className="card-flip">
                    <div className="card-flip-inner">
                      {/* Front of the card */}
                      <div className="card-flip-front">
                        <div className="card h-100 border-0 shadow-sm">
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
                            <p className="client-name mb-0 mt-2">
                              {typeof client.name === 'object' ? 
                                (client.name[t('language')] || client.name.en || 'Client') : 
                                (client.name || 'Client')}
                            </p>
                            <span className="client-type badge bg-secondary mt-1">
                              {typeof client.type === 'object' ? 
                                (client.type[t('language')] || client.type.en || '') : 
                                (client.type || '')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back of the card */}
                      <div className="card-flip-back">
                        <div className="card h-100 border-0 shadow-sm bg-success text-white">
                          <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title mb-2">
                              {typeof client.name === 'object' ? 
                                (client.name[t('language')] || client.name.en || 'Client') : 
                                (client.name || 'Client')}
                            </h5>
                            <div className="client-projects-count mb-2">
                              <span className="projects-number">{client.projects}</span>
                              <span className="projects-label ms-1">{t('ourHolding.clients.projectsCompleted')}</span>
                            </div>
                            <p className="client-highlight">
                              <i className="fas fa-star me-2"></i>
                              {typeof client.highlight === 'object' ? 
                                (client.highlight[t('language')] || client.highlight.en || '') : 
                                (client.highlight || '')}
                            </p>
                          </div>
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
  );
};

export default OurHoldingPage;
