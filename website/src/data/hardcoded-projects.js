// Hardcoded projects data that will work reliably

// Original hardcoded projects - to be used as fallback or defaults
const originalProjects = [
  {
    id: "1",
    title: { 
      en: "Modern Office Building", 
      bg: "Модерна офис сграда", 
      ru: "Современное офисное здание" 
    },
    description: { 
      en: "A sleek new office complex with modern amenities and prime location in the heart of the business district. The building features a unique glass facade that maximizes natural light while maintaining energy efficiency. This project demonstrates our commitment to sustainable development and innovative design solutions.", 
      bg: "Елегантен нов офис комплекс с модерни удобства и първокласна локация в сърцето на бизнес квартала. Сградата разполага с уникална стъклена фасада, която максимизира естествената светлина, като същевременно поддържа енергийна ефективност.", 
      ru: "Элегантный новый офисный комплекс с современными удобствами и первоклассным расположением в центре делового района. В здании уникальный стеклянный фасад, который максимизирует естественное освещение при сохранении энергоэффективности." 
    },
    shortDescription: { 
      en: "A sleek new office complex with modern amenities and prime location.",
      bg: "Елегантен нов офис комплекс с модерни удобства и първокласна локация.",
      ru: "Элегантный новый офисный комплекс с современными удобствами и первоклассным расположением."
    },
    category: { 
      en: "Commercial", 
      bg: "Търговско", 
      ru: "Коммерческое" 
    },
    subcategory: {
      en: "Office Building",
      bg: "Офис сграда",
      ru: "Офисное здание"
    },
    status: "in-progress",
    featured: true,
    completionPercentage: 70,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    location: {
      address: { 
        en: "123 Business Avenue, Financial District", 
        bg: "Бизнес Авеню 123, Финансов Квартал", 
        ru: "Бизнес Авеню 123, Финансовый квартал" 
      },
      city: { 
        en: "Sofia", 
        bg: "София", 
        ru: "София" 
      },
      country: { 
        en: "Bulgaria", 
        bg: "България", 
        ru: "Болгария" 
      },
      coordinates: {
        lat: 42.6977,
        lng: 23.3219
      }
    },
    specifications: {
      size: {
        value: 12500,
        unit: "m²"
      },
      capacity: {
        value: 850,
        unit: "people"
      },
      sustainability: {
        features: [
          { 
            en: "Solar panels on rooftop", 
            bg: "Соларни панели на покрива", 
            ru: "Солнечные панели на крыше" 
          },
          { 
            en: "Rainwater harvesting system", 
            bg: "Система за събиране на дъждовна вода", 
            ru: "Система сбора дождевой воды" 
          },
          { 
            en: "High-efficiency HVAC system", 
            bg: "Високоефективна ОВК система", 
            ru: "Высокоэффективная система ОВКВ" 
          },
          { 
            en: "EV charging stations", 
            bg: "Станции за зареждане на електромобили", 
            ru: "Зарядные станции для электромобилей" 
          }
        ]
      }
    },
    duration: {
      value: 24,
      unit: "months"
    },
    financial: {
      budget: {
        total: 18500000,
        currency: "EUR"
      }
    },
    features: [
      { 
        en: "Smart building management system", 
        bg: "Интелигентна система за управление на сградата", 
        ru: "Интеллектуальная система управления зданием" 
      },
      { 
        en: "High-speed elevators with smart access control", 
        bg: "Високоскоростни асансьори с интелигентен контрол на достъпа", 
        ru: "Скоростные лифты с интеллектуальным контролем доступа" 
      },
      { 
        en: "Floor-to-ceiling windows with UV protection", 
        bg: "Прозорци от пода до тавана с UV защита", 
        ru: "Окна от пола до потолка с защитой от ультрафиолета" 
      },
      { 
        en: "Shared conference center and business facilities", 
        bg: "Споделен конферентен център и бизнес съоръжения", 
        ru: "Общий конференц-центр и бизнес-объекты" 
      },
      { 
        en: "Rooftop garden and recreation area", 
        bg: "Покривна градина и зона за отдих", 
        ru: "Сад на крыше и зона отдыха" 
      }
    ],
    client: {
      name: { 
        en: "Global Business Partners Ltd.", 
        bg: "Глобал Бизнес Партнърс ООД", 
        ru: "Глобал Бизнес Партнерс ООО" 
      },
      industry: { 
        en: "Real Estate Development", 
        bg: "Развитие на Недвижими Имоти", 
        ru: "Девелопмент Недвижимости" 
      },
      logo: "https://placehold.co/200x100/0056b3/ffffff?text=GBP+Ltd"
    },
    team: {
      architects: [
        { 
          name: { 
            en: "Modern Architects Studio", 
            bg: "Модерно Архитектурно Студио", 
            ru: "Современная Архитектурная Студия" 
          },
          role: { 
            en: "Lead Design", 
            bg: "Водещ Дизайн", 
            ru: "Ведущий Дизайн" 
          },
          logo: "https://placehold.co/200x100/0056b3/ffffff?text=MAS"
        }
      ],
      contractors: [
        { 
          name: { 
            en: "BuildHolding Construction", 
            bg: "БилдХолдинг Строителство", 
            ru: "БилдХолдинг Строительство" 
          },
          role: { 
            en: "General Contractor", 
            bg: "Главен Изпълнител", 
            ru: "Генеральный Подрядчик" 
          },
          logo: "https://placehold.co/200x100/0056b3/ffffff?text=BuildHolding"
        }
      ],
      consultants: [
        { 
          name: { 
            en: "GreenTech Solutions", 
            bg: "ГриинТех Солюшънс", 
            ru: "ГринТех Солюшнс" 
          },
          role: { 
            en: "Sustainability Consultant", 
            bg: "Консултант по Устойчивост", 
            ru: "Консультант по Устойчивому Развитию" 
          },
          logo: "https://placehold.co/200x100/0056b3/ffffff?text=GreenTech"
        }
      ]
    },
    timeline: {
      planning: {
        start: "2023-01-15",
        end: "2023-04-30",
        completed: true
      },
      foundation: {
        start: "2023-05-10",
        end: "2023-08-20",
        completed: true
      },
      structure: {
        start: "2023-09-01",
        end: "2024-03-15",
        completed: true
      },
      facade: {
        start: "2024-02-01",
        end: "2024-07-30",
        completed: false,
        inProgress: true
      },
      interiors: {
        start: "2024-05-01",
        end: "2024-11-30",
        completed: false,
        inProgress: true
      },
      landscaping: {
        start: "2024-09-01",
        end: "2024-12-15",
        completed: false,
        inProgress: false
      },
      completion: {
        start: "2024-12-01",
        end: "2025-01-31",
        completed: false,
        inProgress: false
      }
    }
  },
  {
    id: "2",
    title: { en: "Residential Complex Sunset", bg: "Жилищен комплекс Сънсет", ru: "Жилой комплекс Сансет" },
    description: { en: "A vibrant residential community with modern amenities and beautiful views.", bg: "Живописна жилищна общност с модерни удобства.", ru: "Яркий жилой комплекс с современными удобствами." },
    shortDescription: { 
      en: "A vibrant residential community with modern apartments and scenic views.",
      bg: "Живописна жилищна общност с модерни апартаменти и панорамни гледки.",
      ru: "Яркий жилой комплекс с современными апартаментами и живописными видами."
    },
    category: { en: "Residential", bg: "Жилищно", ru: "Жилое" },
    subcategory: { en: "Apartment Complex", bg: "Жилищен комплекс", ru: "Жилой комплекс" },
    status: "complete",
    featured: true,
    completionPercentage: 100,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    gallery: [
      { 
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: { en: "Sunset Complex Exterior", bg: "Екстериор на комплекс Сънсет", ru: "Экстерьер комплекса Сансет" }
      },
      { 
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: { en: "Interior Living Space", bg: "Вътрешно жилищно пространство", ru: "Внутреннее жилое пространство" }
      }
    ],
    location: {
      address: { 
        en: "45 Sunset Boulevard, Residential District", 
        bg: "Булевард Залез 45, Жилищен Квартал", 
        ru: "Бульвар Закат 45, Жилой Район" 
      },
      coordinates: {
        lat: 42.7102,
        lng: 23.3241
      }
    },
    specifications: {
      size: {
        value: 8500,
        unit: "m²"
      },
      capacity: {
        value: 120,
        unit: "units"
      },
      sustainability: {
        features: [
          { 
            en: "Green roof garden", 
            bg: "Зелена градина на покрива", 
            ru: "Зеленый сад на крыше" 
          },
          { 
            en: "Solar water heating", 
            bg: "Соларно загряване на вода", 
            ru: "Солнечное отопление воды" 
          }
        ]
      }
    },
    duration: {
      value: 18,
      unit: "months"
    },
    financial: {
      budget: {
        total: 12500000,
        currency: "EUR"
      }
    },
    features: [
      { 
        en: "Rooftop swimming pool", 
        bg: "Басейн на покрива", 
        ru: "Бассейн на крыше" 
      },
      { 
        en: "Fitness center", 
        bg: "Фитнес център", 
        ru: "Фитнес-центр" 
      },
      { 
        en: "Children's playground", 
        bg: "Детска площадка", 
        ru: "Детская площадка" 
      },
      { 
        en: "24/7 security", 
        bg: "24/7 охрана", 
        ru: "Круглосуточная охрана" 
      }
    ]
  },
  {
    id: "3",
    title: { en: "Solar Energy Park", bg: "Соларен Енергиен Парк", ru: "Солнечный Энергетический Парк" },
    description: { en: "A large-scale solar energy production facility with state-of-the-art photovoltaic technology.", bg: "Широкомащабно съоръжение за производство на слънчева енергия с най-съвременна фотоволтаична технология.", ru: "Крупномасштабная солнечная электростанция с современной фотоэлектрической технологией." },
    shortDescription: { 
      en: "Renewable energy production facility with modern solar technology.",
      bg: "Съоръжение за производство на възобновяема енергия с модерна соларна технология.",
      ru: "Объект по производству возобновляемой энергии с современной солнечной технологией."
    },
    category: { en: "Energy", bg: "Енергия", ru: "Энергетика" },
    subcategory: { en: "Renewable", bg: "Възобновяема", ru: "Возобновляемая" },
    status: "in-progress",
    featured: true,
    completionPercentage: 60,
    image: "https://images.unsplash.com/photo-1613665813446-82a78b7127aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    thumbnail: "https://images.unsplash.com/photo-1613665813446-82a78b7127aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    gallery: [
      { 
        url: "https://images.unsplash.com/photo-1613665813446-82a78b7127aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: { en: "Solar Panel Array", bg: "Масив от слънчеви панели", ru: "Массив солнечных панелей" }
      },
      { 
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
        alt: { en: "Control Station", bg: "Контролна станция", ru: "Пункт управления" }
      }
    ],
    location: {
      address: { 
        en: "Rural Area 123, Southern Region", 
        bg: "Селски район 123, Южен регион", 
        ru: "Сельская местность 123, Южный регион" 
      },
      coordinates: {
        lat: 42.5102,
        lng: 23.2241
      }
    },
    specifications: {
      size: {
        value: 50,
        unit: "ha"
      },
      capacity: {
        value: 45,
        unit: "MW"
      },
      sustainability: {
        features: [
          { 
            en: "Zero-emission energy generation", 
            bg: "Производство на енергия с нулеви емисии", 
            ru: "Производство энергии с нулевым выбросом" 
          },
          { 
            en: "Smart grid integration", 
            bg: "Интеграция в интелигентна мрежа", 
            ru: "Интеграция в интеллектуальную сеть" 
          }
        ]
      }
    },
    duration: {
      value: 12,
      unit: "months"
    },
    financial: {
      budget: {
        total: 35000000,
        currency: "EUR"
      }
    },
    features: [
      { 
        en: "Advanced solar tracking system", 
        bg: "Усъвършенствана система за проследяване на слънцето", 
        ru: "Улучшенная система слежения за солнцем" 
      },
      { 
        en: "Energy storage solution", 
        bg: "Решение за съхранение на енергия", 
        ru: "Решение для хранения энергии" 
      },
      { 
        en: "Remote monitoring and control", 
        bg: "Дистанционно наблюдение и контрол", 
        ru: "Удаленный мониторинг и контроль" 
      }
    ]
  },
  {
    id: "4",
    title: { en: "Water Treatment Facility", bg: "Пречиствателна станция за води", ru: "Водоочистное сооружение" },
    description: { en: "Modern water purification and treatment facility serving the metropolitan area with sustainable technology.", bg: "Модерно съоръжение за пречистване на води, обслужващо столичния район с устойчива технология.", ru: "Современное очистное сооружение, обслуживающее столичный район с использованием экологически устойчивых технологий." },
    shortDescription: { 
      en: "Water purification facility serving the metropolitan area.",
      bg: "Съоръжение за пречистване на води, обслужващо столичния район.",
      ru: "Водоочистные сооружения, обслуживающие столичный район."
    },
    category: { en: "Infrastructure", bg: "Инфраструктура", ru: "Инфраструктура" },
    subcategory: { en: "Water Management", bg: "Управление на водите", ru: "Управление водными ресурсами" },
    status: "planned",
    featured: false,
    completionPercentage: 15,
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    gallery: [
      { 
        url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: { en: "Water Treatment Plant", bg: "Станция за пречистване на води", ru: "Очистные сооружения" }
      }
    ],
    location: {
      address: { 
        en: "Industrial Zone East, Metropolitan Area", 
        bg: "Източна индустриална зона, Столична област", 
        ru: "Восточная промышленная зона, Столичная область" 
      },
      coordinates: {
        lat: 42.8102,
        lng: 23.4241
      }
    },
    specifications: {
      size: {
        value: 5,
        unit: "ha"
      },
      capacity: {
        value: 250000,
        unit: "m³/day"
      },
      sustainability: {
        features: [
          { 
            en: "Biogas energy recovery", 
            bg: "Оползотворяване на биогаз енергия", 
            ru: "Рекуперация энергии из биогаза" 
          },
          { 
            en: "Chemical-free purification stages", 
            bg: "Етапи на пречистване без химикали", 
            ru: "Этапы очистки без химикатов" 
          }
        ]
      }
    },
    duration: {
      value: 30,
      unit: "months"
    },
    financial: {
      budget: {
        total: 42000000,
        currency: "EUR"
      }
    },
    features: [
      { 
        en: "Multi-stage purification process", 
        bg: "Многоетапен процес на пречистване", 
        ru: "Многоступенчатый процесс очистки" 
      },
      { 
        en: "Advanced monitoring sensors", 
        bg: "Усъвършенствани сензори за мониторинг", 
        ru: "Улучшенные датчики мониторинга" 
      },
      { 
        en: "Public education center", 
        bg: "Център за обществено образование", 
        ru: "Центр общественного образования" 
      }
    ]
  },
  {
    id: "5",
    title: { en: "Industrial Logistics Center", bg: "Индустриален логистичен център", ru: "Промышленный логистический центр" },
    description: { en: "State-of-the-art logistics and distribution facility with efficient warehousing and transportation hub.", bg: "Съвременен логистичен и дистрибуторски център с ефективни складови и транспортни възможности.", ru: "Современный логистический и дистрибьюторский центр с эффективными складскими и транспортными возможностями." },
    shortDescription: { 
      en: "Modern distribution facility with advanced logistics solutions.",
      bg: "Модерен дистрибуторски център с усъвършенствани логистични решения.",
      ru: "Современный распределительный центр с передовыми логистическими решениями."
    },
    category: { en: "Industrial", bg: "Индустриално", ru: "Промышленное" },
    subcategory: { en: "Logistics", bg: "Логистика", ru: "Логистика" },
    status: "complete",
    featured: false,
    completionPercentage: 100,
    image: "https://images.unsplash.com/photo-1586528116493-a029325540fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    thumbnail: "https://images.unsplash.com/photo-1586528116493-a029325540fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    gallery: [
      { 
        url: "https://images.unsplash.com/photo-1586528116493-a029325540fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: { en: "Logistics Center Exterior", bg: "Екстериор на логистичен център", ru: "Экстерьер логистического центра" }
      },
      { 
        url: "https://images.unsplash.com/photo-1557761469-f29c6e201784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        alt: { en: "Warehouse Interior", bg: "Интериор на склад", ru: "Интерьер склада" }
      }
    ],
    location: {
      address: { 
        en: "Industrial Park Zone, Eastern District", 
        bg: "Индустриална Паркова Зона, Източен Район", 
        ru: "Индустриальная Парковая Зона, Восточный Район" 
      },
      coordinates: {
        lat: 42.6377,
        lng: 23.4019
      }
    },
    specifications: {
      size: {
        value: 35000,
        unit: "m²"
      },
      capacity: {
        value: 15000,
        unit: "tons"
      },
      sustainability: {
        features: [
          { 
            en: "Energy-efficient lighting system", 
            bg: "Енергийно ефективна осветителна система", 
            ru: "Энергоэффективная система освещения" 
          },
          { 
            en: "Rainwater collection for technical usage", 
            bg: "Събиране на дъждовна вода за техническо ползване", 
            ru: "Сбор дождевой воды для технического использования" 
          }
        ]
      }
    },
    duration: {
      value: 14,
      unit: "months"
    },
    financial: {
      budget: {
        total: 16800000,
        currency: "EUR"
      }
    },
    features: [
      { 
        en: "Automated inventory management", 
        bg: "Автоматизирано управление на инвентара", 
        ru: "Автоматизированное управление инвентарем" 
      },
      { 
        en: "Temperature-controlled storage areas", 
        bg: "Зони за съхранение с контролирана температура", 
        ru: "Зоны хранения с контролируемой температурой" 
      },
      { 
        en: "Efficient loading docks", 
        bg: "Ефективни товарни докове", 
        ru: "Эффективные погрузочные доки" 
      },
      { 
        en: "Integrated fleet management", 
        bg: "Интегрирано управление на автопарка", 
        ru: "Интегрированное управление автопарком" 
      }
    ]
  }
];

// Export the original projects directly
export default originalProjects;
