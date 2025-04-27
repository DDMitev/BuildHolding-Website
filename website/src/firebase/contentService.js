/**
 * Firebase Content Service
 * 
 * Handles persistence and retrieval of page content using Firebase Firestore
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  deleteField
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const HOME_CONTENT_COLLECTION = 'home_content';
const CONTACT_CONTENT_COLLECTION = 'contact_content';
const HOLDING_CONTENT_COLLECTION = 'holding_content';

// Document IDs - using a single document for each content type
const CONTENT_DOC_ID = 'main';

// Default home content structure with multilingual support
export const defaultHomeContent = {
  hero: {
    title: {
      en: "Building Excellence",
      bg: "Изграждаме Съвършенство",
      ru: "Строим Совершенство"
    },
    subtitle: {
      en: "Creating landmark properties with innovation and integrity",
      bg: "Създаваме забележителни имоти с иновации и почтеност",
      ru: "Создаем знаковые объекты с инновациями и честностью"
    },
    buttonText: {
      en: "View Our Projects",
      bg: "Вижте нашите проекти",
      ru: "Посмотреть наши проекты"
    },
    backgroundImage: "/images/hero-bg.jpg"
  },
  about: {
    title: {
      en: "Building Excellence Since 1995",
      bg: "Изграждаме Съвършенство от 1995",
      ru: "Строим Совершенство с 1995 года"
    },
    description1: {
      en: "BuildHolding is a premier construction company specializing in commercial and residential properties across Bulgaria.",
      bg: "BuildHolding е водеща строителна компания, специализирана в търговски и жилищни имоти в цяла България.",
      ru: "BuildHolding - ведущая строительная компания, специализирующаяся на коммерческой и жилой недвижимости по всей Болгарии."
    },
    description2: {
      en: "With over 25 years of experience, we've established ourselves as a trusted partner for clients seeking quality, innovation, and reliability.",
      bg: "С над 25 години опит се утвърдихме като надежден партньор за клиенти, търсещи качество, иновации и надеждност.",
      ru: "С более чем 25-летним опытом мы зарекомендовали себя как надежный партнер для клиентов, ищущих качество, инновации и надежность."
    },
    buttonText: {
      en: "Learn About Us",
      bg: "Научете повече за нас",
      ru: "Узнать о нас больше"
    },
    image: "https://picsum.photos/seed/about/700/500"
  },
  featured: {
    title: {
      en: "Featured Projects",
      bg: "Избрани Проекти",
      ru: "Избранные Проекты"
    },
    subtitle: {
      en: "Explore our latest and most notable work",
      bg: "Разгледайте нашите най-нови и забележителни проекти",
      ru: "Ознакомьтесь с нашими последними и наиболее значимыми работами"
    },
    viewDetails: {
      en: "View Details",
      bg: "Вижте детайли",
      ru: "Подробнее"
    },
    viewAll: {
      en: "View All Projects",
      bg: "Вижте всички проекти",
      ru: "Все проекты"
    },
    projectIds: [] // IDs of featured projects
  },
  services: {
    title: {
      en: "Our Services",
      bg: "Нашите Услуги",
      ru: "Наши Услуги"
    },
    subtitle: {
      en: "Comprehensive solutions for all your construction needs",
      bg: "Цялостни решения за всички ваши строителни нужди",
      ru: "Комплексные решения для всех ваших строительных потребностей"
    },
    items: [
      {
        icon: "fas fa-building",
        title: {
          en: "Commercial Construction",
          bg: "Търговско Строителство",
          ru: "Коммерческое Строительство"
        },
        description: {
          en: "Office buildings, retail spaces, and industrial facilities built to the highest standards.",
          bg: "Офис сгради, търговски площи и индустриални съоръжения, изградени по най-високите стандарти.",
          ru: "Офисные здания, торговые площади и промышленные объекты, построенные по высочайшим стандартам."
        }
      },
      {
        icon: "fas fa-home",
        title: {
          en: "Residential Development",
          bg: "Жилищно Строителство",
          ru: "Жилищное Строительство"
        },
        description: {
          en: "Luxury apartments, family homes, and residential complexes designed for modern living.",
          bg: "Луксозни апартаменти, семейни къщи и жилищни комплекси, проектирани за модерен начин на живот.",
          ru: "Роскошные апартаменты, семейные дома и жилые комплексы, разработанные для современной жизни."
        }
      },
      {
        icon: "fas fa-tools",
        title: {
          en: "Renovation & Remodeling",
          bg: "Ремонт и Реконструкция",
          ru: "Реконструкция и Ремонт"
        },
        description: {
          en: "Transform existing spaces with our expert renovation and remodeling services.",
          bg: "Трансформирайте съществуващите пространства с нашите експертни услуги за ремонт и реконструкция.",
          ru: "Трансформируйте существующие пространства с помощью наших экспертных услуг по реконструкции и ремонту."
        }
      }
    ]
  },
  cta: {
    title: {
      en: "Ready to start your project?",
      bg: "Готови ли сте да започнете вашия проект?",
      ru: "Готовы начать свой проект?"
    },
    subtitle: {
      en: "Contact us today for a free consultation and quote.",
      bg: "Свържете се с нас още днес за безплатна консултация и оферта.",
      ru: "Свяжитесь с нами сегодня для бесплатной консультации и расчета стоимости."
    },
    buttonText: {
      en: "Get in Touch",
      bg: "Свържете се с нас",
      ru: "Связаться с нами"
    }
  }
};

// Default contact content
export const defaultContactContent = {
  header: {
    title: {
      en: "Contact Us",
      bg: "Свържете се с нас",
      ru: "Свяжитесь с нами"
    },
    subtitle: {
      en: "We're here to answer your questions and discuss your project needs",
      bg: "Тук сме, за да отговорим на вашите въпроси и да обсъдим нуждите на вашия проект",
      ru: "Мы здесь, чтобы ответить на ваши вопросы и обсудить потребности вашего проекта"
    }
  },
  officeInfo: {
    title: {
      en: "Office",
      bg: "Офис",
      ru: "Офис"
    },
    address: {
      en: "123 Construction Blvd, Sofia, Bulgaria",
      bg: "бул. Строителство 123, София, България",
      ru: "123 Строительный бульвар, София, Болгария"
    },
    phone: "+359 2 123 4567",
    email: "info@buildholding.com",
    hours: {
      en: "Monday - Friday: 9:00 AM - 6:00 PM",
      bg: "Понеделник - Петък: 9:00 - 18:00",
      ru: "Понедельник - Пятница: 9:00 - 18:00"
    }
  },
  formLabels: {
    name: {
      en: "Your Name",
      bg: "Вашето име",
      ru: "Ваше имя"
    },
    email: {
      en: "Your Email",
      bg: "Вашият имейл",
      ru: "Ваш электронный адрес"
    },
    phone: {
      en: "Phone (optional)",
      bg: "Телефон (по избор)",
      ru: "Телефон (необязательно)"
    },
    subject: {
      en: "Subject",
      bg: "Тема",
      ru: "Тема"
    },
    message: {
      en: "Your Message",
      bg: "Вашето съобщение",
      ru: "Ваше сообщение"
    },
    submit: {
      en: "Send Message",
      bg: "Изпратете съобщение",
      ru: "Отправить сообщение"
    }
  },
  mapLocation: {
    latitude: 42.6977,
    longitude: 23.3219,
    zoom: 15
  },
  social: {
    facebook: "https://facebook.com/buildholding",
    instagram: "https://instagram.com/buildholding",
    linkedin: "https://linkedin.com/company/buildholding"
  }
};

// Default holding content
export const defaultHoldingContent = {
  hero: {
    title: {
      en: "Our Holding Structure",
      bg: "Структура на холдинга",
      ru: "Структура холдинга"
    },
    subtitle: {
      en: "A family of companies working together to deliver excellence",
      bg: "Семейство от компании, работещи заедно за постигане на съвършенство",
      ru: "Семья компаний, работающих вместе для достижения совершенства"
    },
    backgroundImage: "/images/hero-bg-holding.jpg"
  },
  overview: {
    title: {
      en: "Company Overview",
      bg: "Преглед на компанията",
      ru: "Обзор компании"
    },
    description: {
      en: "BuildHolding was established to create synergy between various construction and real estate businesses. Our integrated approach allows us to tackle complex projects efficiently.",
      bg: "BuildHolding е създаден, за да създаде синергия между различни строителни и компании за недвижими имоти. Нашият интегриран подход ни позволява да се справяме ефективно със сложни проекти.",
      ru: "BuildHolding был создан для создания синергии между различными строительными компаниями и компаниями, занимающимися недвижимостью. Наш интегрированный подход позволяет нам эффективно решать сложные проекты."
    },
    image: "/images/holding-overview.jpg"
  },
  values: {
    title: {
      en: "Our Values",
      bg: "Нашите ценности",
      ru: "Наши ценности"
    },
    items: [
      {
        icon: "fas fa-handshake",
        title: {
          en: "Integrity",
          bg: "Почтеност",
          ru: "Честность"
        },
        description: {
          en: "We maintain the highest standards of honesty and transparency in all our dealings.",
          bg: "Поддържаме най-високите стандарти за честност и прозрачност във всички наши дейности.",
          ru: "Мы поддерживаем высочайшие стандарты честности и прозрачности во всех наших делах."
        }
      },
      {
        icon: "fas fa-award",
        title: {
          en: "Quality",
          bg: "Качество",
          ru: "Качество"
        },
        description: {
          en: "We never compromise on quality and strive for excellence in every project.",
          bg: "Никога не правим компромис с качеството и се стремим към съвършенство във всеки проект.",
          ru: "Мы никогда не идем на компромисс в отношении качества и стремимся к совершенству в каждом проекте."
        }
      },
      {
        icon: "fas fa-lightbulb",
        title: {
          en: "Innovation",
          bg: "Иновация",
          ru: "Инновация"
        },
        description: {
          en: "We embrace new technologies and methods to stay at the forefront of the industry.",
          bg: "Възприемаме нови технологии и методи, за да останем на челна линия в индустрията.",
          ru: "Мы внедряем новые технологии и методы, чтобы оставаться на переднем крае отрасли."
        }
      },
      {
        icon: "fas fa-leaf",
        title: {
          en: "Sustainability",
          bg: "Устойчивост",
          ru: "Устойчивость"
        },
        description: {
          en: "We're committed to environmentally responsible practices in every project.",
          bg: "Ангажирани сме с екологично отговорни практики във всеки проект.",
          ru: "Мы привержены экологически ответственным практикам в каждом проекте."
        }
      }
    ]
  },
  stats: {
    title: {
      en: "BuildHolding in Numbers",
      bg: "BuildHolding в цифри",
      ru: "BuildHolding в цифрах"
    },
    items: [
      {
        number: "25+",
        label: {
          en: "Years of Experience",
          bg: "Години опит",
          ru: "Лет опыта"
        }
      },
      {
        number: "10+",
        label: {
          en: "Companies",
          bg: "Компании",
          ru: "Компаний"
        }
      },
      {
        number: "500+",
        label: {
          en: "Completed Projects",
          bg: "Завършени проекти",
          ru: "Завершенных проектов"
        }
      },
      {
        number: "1000+",
        label: {
          en: "Team Members",
          bg: "Членове на екипа",
          ru: "Членов команды"
        }
      }
    ]
  },
  structure: {
    title: {
      en: "Our Companies",
      bg: "Нашите компании",
      ru: "Наши компании"
    },
    companies: [
      {
        id: "construction",
        name: {
          en: "BuildConstruction Ltd.",
          bg: "BuildConstruction ООД",
          ru: "BuildConstruction OOO"
        },
        description: {
          en: "Our flagship construction company specializing in commercial and residential projects.",
          bg: "Нашата флагманска строителна компания, специализирана в търговски и жилищни проекти.",
          ru: "Наша флагманская строительная компания, специализирующаяся на коммерческих и жилых проектах."
        },
        icon: "fas fa-building"
      },
      {
        id: "design",
        name: {
          en: "BuildDesign Ltd.",
          bg: "BuildDesign ООД",
          ru: "BuildDesign OOO"
        },
        description: {
          en: "Architectural and interior design services for all types of buildings.",
          bg: "Архитектурни и интериорни дизайнерски услуги за всички видове сгради.",
          ru: "Услуги архитектурного и интерьерного дизайна для всех типов зданий."
        },
        icon: "fas fa-drafting-compass"
      },
      {
        id: "materials",
        name: {
          en: "BuildMaterials Ltd.",
          bg: "BuildMaterials ООД",
          ru: "BuildMaterials OOO"
        },
        description: {
          en: "Production and distribution of high-quality construction materials.",
          bg: "Производство и дистрибуция на висококачествени строителни материали.",
          ru: "Производство и распространение высококачественных строительных материалов."
        },
        icon: "fas fa-truck-loading"
      },
      {
        id: "engineering",
        name: {
          en: "BuildEngineering Ltd.",
          bg: "BuildEngineering ООД",
          ru: "BuildEngineering OOO"
        },
        description: {
          en: "Engineering solutions for complex construction challenges.",
          bg: "Инженерни решения за сложни строителни предизвикателства.",
          ru: "Инженерные решения для сложных строительных задач."
        },
        icon: "fas fa-cogs"
      }
    ]
  },
  history: {
    title: {
      en: "Our History",
      bg: "Нашата история",
      ru: "Наша история"
    },
    description: {
      en: "From our humble beginnings as a small contractor to becoming a leading construction holding in the region.",
      bg: "От скромните ни начала като малък строителен изпълнител до превръщането ни във водещ строителен холдинг в региона.",
      ru: "От наших скромных начинаний в качестве небольшого строительного подрядчика до превращения в ведущий строительный холдинг в регионе."
    },
    milestones: [
      { 
        year: "1995", 
        title: {
          en: "Company Founded",
          bg: "Основаване на компанията",
          ru: "Основание компании"
        }, 
        description: {
          en: "Started as a small residential contractor in Sofia with just 5 employees.",
          bg: "Започнахме като малък жилищен изпълнител в София с едва 5 служители.",
          ru: "Начали как маленький жилищный подрядчик в Софии с всего 5 сотрудниками."
        },
        icon: "fa-building",
        bgColor: "#0056b3"
      },
      { 
        year: "2005", 
        title: {
          en: "Commercial Expansion",
          bg: "Търговско разширение",
          ru: "Коммерческое расширение"
        }, 
        description: {
          en: "Secured our first major commercial contracts throughout Bulgaria.",
          bg: "Осигурихме първите си големи търговски договори в цяла България.",
          ru: "Обеспечили наши первые крупные коммерческие контракты по всей Болгарии."
        },
        icon: "fa-city",
        bgColor: "#ff7722"
      },
      { 
        year: "2010", 
        title: {
          en: "International Projects",
          bg: "Международни проекти",
          ru: "Международные проекты"
        }, 
        description: {
          en: "Expanded operations to Romania, Serbia and Greece.",
          bg: "Разширихме дейността си в Румъния, Сърбия и Гърция.",
          ru: "Расширили операции в Румынию, Сербию и Грецию."
        },
        icon: "fa-globe-europe",
        bgColor: "#28a745"
      },
      { 
        year: "2020", 
        title: {
          en: "Holding Formation",
          bg: "Формиране на холдинг",
          ru: "Формирование холдинга"
        }, 
        description: {
          en: "Reorganized as BuildHolding with multiple specialized subsidiaries.",
          bg: "Реорганизирахме се като BuildHolding с множество специализирани дъщерни дружества.",
          ru: "Реорганизовались в BuildHolding с несколькими специализированными дочерними компаниями."
        },
        icon: "fa-sitemap",
        bgColor: "#6610f2"
      }
    ]
  },
  tabs: {
    mission: {
      title: {
        en: "Our Mission",
        bg: "Нашата мисия",
        ru: "Наша миссия"
      },
      content: {
        en: "BuildHolding's mission is to deliver exceptional construction and development services through our family of specialized companies, focusing on innovation, quality, and client satisfaction. We aim to transform the built environment while maintaining the highest standards of ethical business practices.",
        bg: "Мисията на BuildHolding е да предоставя изключителни строителни и развойни услуги чрез нашето семейство от специализирани компании, фокусирайки се върху иновации, качество и удовлетвореност на клиентите. Стремим се да трансформираме изградената среда, като поддържаме най-високите стандарти за етични бизнес практики.",
        ru: "Миссия BuildHolding - предоставлять исключительные строительные и девелоперские услуги через наше семейство специализированных компаний, уделяя особое внимание инновациям, качеству и удовлетворенности клиентов. Мы стремимся преобразить построенную среду, соблюдая самые высокие стандарты этичной деловой практики."
      }
    },
    who: {
      title: {
        en: "Who We Are",
        bg: "Кои сме ние",
        ru: "Кто мы"
      },
      content: {
        en: "At BuildHolding, we are a family of specialized construction and real estate companies working together to create extraordinary buildings and spaces. With decades of combined experience, our team brings expertise in every aspect of the construction process, from initial planning to project delivery and beyond.",
        bg: "В BuildHolding сме семейство от специализирани строителни компании и компании за недвижими имоти, които работят заедно за създаването на изключителни сгради и пространства. С десетилетия комбиниран опит, нашият екип внася експертиза във всеки аспект на строителния процес, от първоначалното планиране до предаването на проекта и след това.",
        ru: "В BuildHolding мы представляем семью специализированных строительных компаний и компаний по недвижимости, работающих вместе для создания выдающихся зданий и пространств. Имея многолетний совокупный опыт, наша команда привносит знания во все аспекты строительного процесса, от первоначального планирования до сдачи проекта и далее."
      }
    },
    team: {
      title: {
        en: "Our Team",
        bg: "Нашият екип",
        ru: "Наша команда"
      },
      content: {
        en: "BuildHolding brings together the best talent in the construction industry. Our diverse team of professionals includes architects, engineers, project managers, craftsmen, and specialists who share a common commitment to excellence. Together, we collaborate to deliver exceptional results on every project.",
        bg: "BuildHolding събира най-добрите таланти в строителната индустрия. Нашият разнообразен екип от професионалисти включва архитекти, инженери, проектни мениджъри, занаятчии и специалисти, които споделят общ ангажимент към съвършенството. Заедно си сътрудничим, за да постигнем изключителни резултати при всеки проект.",
        ru: "BuildHolding объединяет лучшие таланты в строительной отрасли. Наша разнообразная команда профессионалов включает архитекторов, инженеров, руководителей проектов, мастеров и специалистов, которых объединяет общая приверженность совершенству. Вместе мы сотрудничаем, чтобы достичь исключительных результатов в каждом проекте."
      }
    },
    equipment: {
      title: {
        en: "Equipment & Technology",
        bg: "Оборудване и технологии",
        ru: "Оборудование и технологии"
      },
      description: {
        en: "BuildHolding companies utilize state-of-the-art equipment and cutting-edge technology to ensure precision, efficiency, and safety across all our construction projects.",
        bg: "Компаниите на BuildHolding използват най-съвременно оборудване и авангардни технологии, за да осигурят прецизност, ефективност и безопасност във всички наши строителни проекти.",
        ru: "Компании BuildHolding используют современное оборудование и передовые технологии для обеспечения точности, эффективности и безопасности во всех наших строительных проектах."
      }
    },
    quality: {
      title: {
        en: "Quality Standards",
        bg: "Стандарти за качество",
        ru: "Стандарты качества"
      },
      description: {
        en: "We maintain rigorous quality control processes and adhere to international and local standards across all our operations. Our companies have earned numerous certifications that reflect our commitment to excellence.",
        bg: "Поддържаме строги процеси за контрол на качеството и се придържаме към международните и местните стандарти във всички наши операции. Нашите компании са получили множество сертификати, които отразяват нашия ангажимент към съвършенството.",
        ru: "Мы поддерживаем строгие процессы контроля качества и придерживаемся международных и местных стандартов во всех наших операциях. Наши компании получили многочисленные сертификаты, отражающие нашу приверженность совершенству."
      }
    },
    timeline: {
      title: {
        en: "Company Timeline",
        bg: "История на компанията",
        ru: "История компании"
      },
      description: {
        en: "Follow our journey from a small construction contractor to a diversified holding with multiple specialized businesses operating across Southeast Europe.",
        bg: "Проследете нашето пътуване от малък строителен изпълнител до диверсифициран холдинг с множество специализирани бизнеси, работещи в Югоизточна Европа.",
        ru: "Проследите наш путь от небольшого строительного подрядчика до диверсифицированного холдинга с несколькими специализированными предприятиями, работающими по всей Юго-Восточной Европе."
      }
    },
    partners: {
      title: {
        en: "Our Partners",
        bg: "Нашите партньори",
        ru: "Наши партнеры"
      },
      description: {
        en: "BuildHolding collaborates with leading suppliers, technology providers, and industry partners to deliver exceptional value and innovation on our projects.",
        bg: "BuildHolding си сътрудничи с водещи доставчици, технологични доставчици и индустриални партньори, за да предостави изключителна стойност и иновации в нашите проекти.",
        ru: "BuildHolding сотрудничает с ведущими поставщиками, технологическими провайдерами и отраслевыми партнерами, чтобы обеспечить исключительную ценность и инновации в наших проектах."
      }
    },
    clients: {
      title: {
        en: "Our Clients",
        bg: "Нашите клиенти",
        ru: "Наши клиенты"
      },
      description: {
        en: "We are proud to have worked with a diverse range of clients across the public and private sectors. Our client relationships are built on trust, transparency, and consistently delivering high-quality results.",
        bg: "Гордеем се, че сме работили с разнообразен кръг от клиенти от публичния и частния сектор. Нашите взаимоотношения с клиентите се основават на доверие, прозрачност и постоянно предоставяне на висококачествени резултати.",
        ru: "Мы гордимся тем, что работали с различными клиентами из государственного и частного секторов. Наши отношения с клиентами строятся на доверии, прозрачности и стабильном предоставлении высококачественных результатов."
      }
    }
  }
};

/**
 * Initialize Firestore content collections with default data if they don't exist
 */
export const initializeFirestoreContent = async () => {
  try {
    // Initialize Home Content
    const homeDocRef = doc(db, HOME_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const homeDocSnap = await getDoc(homeDocRef);
    
    if (!homeDocSnap.exists()) {
      await setDoc(homeDocRef, {
        ...defaultHomeContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Initialized default home content in Firestore');
    }
    
    // Initialize Contact Content
    const contactDocRef = doc(db, CONTACT_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const contactDocSnap = await getDoc(contactDocRef);
    
    if (!contactDocSnap.exists()) {
      await setDoc(contactDocRef, {
        ...defaultContactContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Initialized default contact content in Firestore');
    }
    
    // Initialize Holding Content
    const holdingDocRef = doc(db, HOLDING_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const holdingDocSnap = await getDoc(holdingDocRef);
    
    if (!holdingDocSnap.exists()) {
      await setDoc(holdingDocRef, {
        ...defaultHoldingContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Initialized default holding content in Firestore');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firestore content:', error);
    return false;
  }
};

/**
 * Get home content from Firestore
 * @returns {Promise<Object>} Home content object or default if not found
 */
export const getHomeContent = async () => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, HOME_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Retrieved home content from Firestore');
      
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultHomeContent,
        ...data,
        hero: {
          ...defaultHomeContent.hero,
          ...(data.hero || {})
        },
        about: {
          ...defaultHomeContent.about,
          ...(data.about || {})
        },
        featured: {
          ...defaultHomeContent.featured,
          ...(data.featured || {})
        },
        services: {
          ...defaultHomeContent.services,
          ...(data.services || {})
        },
        cta: {
          ...defaultHomeContent.cta,
          ...(data.cta || {})
        }
      };
    }
    
    return defaultHomeContent;
  } catch (error) {
    console.error('Error getting home content from Firestore:', error);
    return defaultHomeContent;
  }
};

/**
 * Save home content to Firestore
 * @param {Object} content Home content object
 * @returns {Promise<boolean>} Success status
 */
export const saveHomeContent = async (content) => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, HOME_CONTENT_COLLECTION, CONTENT_DOC_ID);
    
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Saved home content to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving home content to Firestore:', error);
    return false;
  }
};

/**
 * Get contact content from Firestore
 * @returns {Promise<Object>} Contact content object or default if not found
 */
export const getContactContent = async () => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, CONTACT_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Retrieved contact content from Firestore');
      
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultContactContent,
        ...data,
        header: {
          ...defaultContactContent.header,
          ...(data.header || {})
        },
        officeInfo: {
          ...defaultContactContent.officeInfo,
          ...(data.officeInfo || {})
        },
        formLabels: {
          ...defaultContactContent.formLabels,
          ...(data.formLabels || {})
        },
        mapLocation: {
          ...defaultContactContent.mapLocation,
          ...(data.mapLocation || {})
        },
        social: {
          ...defaultContactContent.social,
          ...(data.social || {})
        }
      };
    }
    
    return defaultContactContent;
  } catch (error) {
    console.error('Error getting contact content from Firestore:', error);
    return defaultContactContent;
  }
};

/**
 * Save contact content to Firestore
 * @param {Object} content Contact content object
 * @returns {Promise<boolean>} Success status
 */
export const saveContactContent = async (content) => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, CONTACT_CONTENT_COLLECTION, CONTENT_DOC_ID);
    
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Saved contact content to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving contact content to Firestore:', error);
    return false;
  }
};

/**
 * Get holding content from Firestore
 * @returns {Promise<Object>} Holding content object or default if not found
 */
export const getHoldingContent = async () => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, HOLDING_CONTENT_COLLECTION, CONTENT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Retrieved holding content from Firestore');
      
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultHoldingContent,
        ...data,
        hero: {
          ...defaultHoldingContent.hero,
          ...(data.hero || {})
        },
        about: {
          ...defaultHoldingContent.about,
          ...(data.about || {})
        },
        overview: {
          ...defaultHoldingContent.overview,
          ...(data.overview || {})
        },
        values: {
          ...defaultHoldingContent.values,
          ...(data.values || {})
        },
        stats: {
          ...defaultHoldingContent.stats,
          ...(data.stats || {})
        },
        structure: {
          ...defaultHoldingContent.structure,
          ...(data.structure || {})
        },
        visionMission: {
          ...defaultHoldingContent.visionMission,
          ...(data.visionMission || {})
        },
        history: {
          ...defaultHoldingContent.history,
          ...(data.history || {})
        },
        tabs: {
          ...defaultHoldingContent.tabs,
          ...(data.tabs || {})
        },
        team: {
          ...defaultHoldingContent.team,
          ...(data.team || {})
        }
      };
    }
    
    return defaultHoldingContent;
  } catch (error) {
    console.error('Error getting holding content from Firestore:', error);
    return defaultHoldingContent;
  }
};

/**
 * Save holding content to Firestore
 * @param {Object} content Holding content object
 * @returns {Promise<boolean>} Success status
 */
export const saveHoldingContent = async (content) => {
  try {
    // Initialize content collections if they don't exist
    await initializeFirestoreContent();
    
    const docRef = doc(db, HOLDING_CONTENT_COLLECTION, CONTENT_DOC_ID);
    
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Saved holding content to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving holding content to Firestore:', error);
    return false;
  }
};

// Migrate data from localStorage to Firestore
export const migrateLocalStorageToFirestore = async () => {
  try {
    // Migrate Home Content
    const HOME_CONTENT_KEY = 'buildholding_home_content';
    const savedHomeContent = localStorage.getItem(HOME_CONTENT_KEY);
    if (savedHomeContent) {
      const parsedHomeContent = JSON.parse(savedHomeContent);
      await saveHomeContent(parsedHomeContent);
      console.log('Migrated home content from localStorage to Firestore');
    }
    
    // Migrate Contact Content
    const CONTACT_CONTENT_KEY = 'buildholding_contact_content';
    const savedContactContent = localStorage.getItem(CONTACT_CONTENT_KEY);
    if (savedContactContent) {
      const parsedContactContent = JSON.parse(savedContactContent);
      await saveContactContent(parsedContactContent);
      console.log('Migrated contact content from localStorage to Firestore');
    }
    
    // Migrate Holding Content
    const HOLDING_CONTENT_KEY = 'buildholding_holding_content';
    const savedHoldingContent = localStorage.getItem(HOLDING_CONTENT_KEY);
    if (savedHoldingContent) {
      const parsedHoldingContent = JSON.parse(savedHoldingContent);
      await saveHoldingContent(parsedHoldingContent);
      console.log('Migrated holding content from localStorage to Firestore');
    }
    
    return true;
  } catch (error) {
    console.error('Error migrating content from localStorage to Firestore:', error);
    return false;
  }
};

const contentService = {
  getHomeContent,
  saveHomeContent,
  getContactContent,
  saveContactContent,
  getHoldingContent,
  saveHoldingContent,
  migrateLocalStorageToFirestore,
  initializeFirestoreContent
};

export default contentService;
