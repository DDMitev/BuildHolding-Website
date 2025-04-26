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
  about: {
    title: {
      en: "About Our Holding",
      bg: "За нашия холдинг",
      ru: "О нашем холдинге"
    },
    description: {
      en: "BuildHolding brings together specialized companies across the construction industry to provide a complete range of services from initial planning to project completion.",
      bg: "BuildHolding обединява специализирани компании в строителната индустрия, за да предостави пълен спектър от услуги от първоначалното планиране до завършването на проекта.",
      ru: "BuildHolding объединяет специализированные компании строительной отрасли, чтобы предоставить полный спектр услуг от первоначального планирования до завершения проекта."
    },
    image: "/images/about-holding.jpg"
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
    subtitle: {
      en: "The principles that guide our business",
      bg: "Принципите, които ръководят нашия бизнес",
      ru: "Принципы, которыми руководствуется наш бизнес"
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
        icon: "fas fa-star",
        title: {
          en: "Excellence",
          bg: "Съвършенство",
          ru: "Совершенство"
        },
        description: {
          en: "We strive for excellence in every project, no matter the size.",
          bg: "Стремим се към съвършенство във всеки проект, независимо от размера.",
          ru: "Мы стремимся к совершенству в каждом проекте, независимо от его размера."
        }
      },
      {
        icon: "fas fa-users",
        title: {
          en: "Collaboration",
          bg: "Сътрудничество",
          ru: "Сотрудничество"
        },
        description: {
          en: "We believe in working together - with our clients and between our companies.",
          bg: "Вярваме в съвместната работа - с нашите клиенти и между нашите компании.",
          ru: "Мы верим в совместную работу - с нашими клиентами и между нашими компаниями."
        }
      }
    ]
  },
  stats: {
    title: {
      en: "Our Impact in Numbers",
      bg: "Нашето въздействие в числа",
      ru: "Наше влияние в цифрах"
    },
    items: [
      {
        number: 25,
        label: {
          en: "Years of Experience",
          bg: "Години опит",
          ru: "Лет опыта"
        }
      },
      {
        number: 500,
        label: {
          en: "Completed Projects",
          bg: "Завършени проекти",
          ru: "Завершенных проектов"
        }
      },
      {
        number: 150,
        label: {
          en: "Skilled Professionals",
          bg: "Квалифицирани професионалисти",
          ru: "Квалифицированных специалистов"
        }
      },
      {
        number: 10,
        label: {
          en: "Subsidiary Companies",
          bg: "Дъщерни компании",
          ru: "Дочерних компаний"
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
        name: {
          en: "BuildConstruct Ltd.",
          bg: "БилдКонструкт ЕООД",
          ru: "БилдКонструкт ООО"
        },
        logo: "/images/company1-logo.png",
        description: {
          en: "Our flagship construction company specializing in commercial and residential buildings.",
          bg: "Нашата водеща строителна компания, специализирана в търговски и жилищни сгради.",
          ru: "Наша флагманская строительная компания, специализирующаяся на коммерческих и жилых зданиях."
        }
      },
      {
        name: {
          en: "DesignMasters Ltd.",
          bg: "ДизайнМастърс ЕООД",
          ru: "ДизайнМастерс ООО"
        },
        logo: "/images/company2-logo.png",
        description: {
          en: "Architectural and interior design studio creating innovative spaces.",
          bg: "Студио за архитектурен и интериорен дизайн, създаващо иновативни пространства.",
          ru: "Студия архитектурного и интерьерного дизайна, создающая инновационные пространства."
        }
      },
      {
        name: {
          en: "EngiTech Solutions",
          bg: "ИнджиТек Солюшънс",
          ru: "ИнжиТех Решения"
        },
        logo: "/images/company3-logo.png",
        description: {
          en: "Engineering consultancy providing structural and MEP solutions.",
          bg: "Инженерна консултантска фирма, предоставяща структурни и MEP решения.",
          ru: "Инженерно-консалтинговая компания, предоставляющая структурные и инженерные решения."
        }
      }
    ]
  },
  visionMission: {
    title: {
      en: "Vision & Mission",
      bg: "Визия и мисия",
      ru: "Видение и миссия"
    },
    vision: {
      title: {
        en: "Our Vision",
        bg: "Нашата визия",
        ru: "Наше видение"
      },
      description: {
        en: "To be Eastern Europe's most trusted and innovative construction holding company, transforming the urban landscape while setting new standards for quality and sustainability.",
        bg: "Да бъдем най-надеждната и иновативна холдингова строителна компания в Източна Европа, трансформирайки градския пейзаж, докато поставяме нови стандарти за качество и устойчивост.",
        ru: "Стать самой надежной и инновационной строительной холдинговой компанией в Восточной Европе, преобразующей городской ландшафт и устанавливающей новые стандарты качества и устойчивости."
      }
    },
    mission: {
      title: {
        en: "Our Mission",
        bg: "Нашата мисия",
        ru: "Наша миссия"
      },
      description: {
        en: "To deliver exceptional construction and development services through our family of specialized companies, focusing on innovation, quality, and client satisfaction.",
        bg: "Да предоставяме изключителни строителни и развойни услуги чрез нашето семейство от специализирани компании, фокусирайки се върху иновации, качество и удовлетвореност на клиентите.",
        ru: "Предоставлять исключительные строительные и девелоперские услуги через наше семейство специализированных компаний, уделяя особое внимание инновациям, качеству и удовлетворенности клиентов."
      }
    }
  },
  history: {
    title: {
      en: "Our History",
      bg: "Нашата история",
      ru: "Наша история"
    },
    subtitle: {
      en: "The journey to becoming a leading holding company",
      bg: "Пътят към превръщането ни във водеща холдингова компания",
      ru: "Путь к становлению ведущей холдинговой компанией"
    },
    milestones: [
      {
        year: "1998",
        title: {
          en: "Foundation",
          bg: "Основаване",
          ru: "Основание"
        },
        description: {
          en: "BuildHolding was established with a single construction company.",
          bg: "BuildHolding беше основан с една строителна компания.",
          ru: "BuildHolding был основан с одной строительной компанией."
        }
      },
      {
        year: "2005",
        title: {
          en: "Expansion",
          bg: "Разширяване",
          ru: "Расширение"
        },
        description: {
          en: "Acquired three more construction companies and expanded into design services.",
          bg: "Придобихме още три строителни компании и се разширихме в дизайнерски услуги.",
          ru: "Приобрели еще три строительные компании и расширились в сферу дизайнерских услуг."
        }
      },
      {
        year: "2015",
        title: {
          en: "International Growth",
          bg: "Международен растеж",
          ru: "Международный рост"
        },
        description: {
          en: "Expanded operations across Eastern Europe with projects in 5 countries.",
          bg: "Разширихме дейността си в Източна Европа с проекти в 5 държави.",
          ru: "Расширили деятельность по всей Восточной Европе с проектами в 5 странах."
        }
      },
      {
        year: "2022",
        title: {
          en: "Innovation Leadership",
          bg: "Лидерство в иновациите",
          ru: "Лидерство в инновациях"
        },
        description: {
          en: "Became the regional leader in sustainable construction and smart building technologies.",
          bg: "Станахме регионален лидер в устойчивото строителство и технологиите за интелигентни сгради.",
          ru: "Стали региональным лидером в области устойчивого строительства и технологий умных зданий."
        }
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
    approach: {
      title: {
        en: "Our Approach",
        bg: "Нашият подход",
        ru: "Наш подход"
      },
      content: {
        en: "At BuildHolding, we take an integrated approach to construction and development. By bringing together specialized expertise from across our family of companies, we can address all aspects of a project - from initial concept and design through to construction, finishing, and maintenance. This holistic approach ensures seamless coordination, cost efficiency, and exceptional results.",
        bg: "В BuildHolding прилагаме интегриран подход към строителството и развитието. Като обединяваме специализиран опит от цялото ни семейство от компании, можем да адресираме всички аспекти на един проект - от първоначалната концепция и дизайн до строителството, довършителните работи и поддръжката. Този холистичен подход осигурява безпроблемна координация, ефективност на разходите и изключителни резултати.",
        ru: "В BuildHolding мы применяем комплексный подход к строительству и девелопменту. Объединяя специализированный опыт нашего семейства компаний, мы можем охватить все аспекты проекта - от первоначальной концепции и дизайна до строительства, отделки и обслуживания. Этот целостный подход обеспечивает бесперебойную координацию, экономическую эффективность и исключительные результаты."
      }
    },
    sustainability: {
      title: {
        en: "Sustainability",
        bg: "Устойчивост",
        ru: "Устойчивость"
      },
      content: {
        en: "Sustainability is at the core of BuildHolding's business philosophy. We are committed to minimizing the environmental impact of our projects through innovative green building practices, energy-efficient designs, and responsible resource management. Our sustainability initiatives extend beyond our projects to our corporate operations and community engagement programs.",
        bg: "Устойчивостта е в основата на бизнес философията на BuildHolding. Ние сме ангажирани да минимизираме въздействието върху околната среда на нашите проекти чрез иновативни практики за зелено строителство, енергийно ефективни дизайни и отговорно управление на ресурсите. Нашите инициативи за устойчивост се простират отвъд нашите проекти до нашите корпоративни операции и програми за ангажиране на общността.",
        ru: "Устойчивость лежит в основе бизнес-философии BuildHolding. Мы стремимся минимизировать воздействие наших проектов на окружающую среду с помощью инновационных практик зеленого строительства, энергоэффективных проектов и ответственного управления ресурсами. Наши инициативы в области устойчивого развития выходят за рамки наших проектов и охватывают корпоративные операции и программы взаимодействия с сообществом."
      }
    }
  },
  team: {
    title: {
      en: "Leadership Team",
      bg: "Лидерски екип",
      ru: "Команда руководителей"
    },
    members: [
      {
        name: "Alexander Petrov",
        image: "/images/team/ceo.jpg",
        position: {
          en: "Chief Executive Officer",
          bg: "Главен изпълнителен директор",
          ru: "Генеральный директор"
        },
        bio: {
          en: "Alexander founded BuildHolding in 1998 and has led its growth into Eastern Europe's premier construction group. He brings over 30 years of industry experience and a vision for sustainable development.",
          bg: "Александър основа BuildHolding през 1998 г. и ръководи растежа ѝ до водеща строителна група в Източна Европа. Той има над 30 години опит в индустрията и визия за устойчиво развитие.",
          ru: "Александр основал BuildHolding в 1998 году и руководил ее ростом до ведущей строительной группы Восточной Европы. Он обладает более чем 30-летним опытом работы в отрасли и видением устойчивого развития."
        }
      },
      {
        name: "Maria Ivanova",
        image: "/images/team/cfo.jpg",
        position: {
          en: "Chief Financial Officer",
          bg: "Главен финансов директор",
          ru: "Финансовый директор"
        },
        bio: {
          en: "Maria joined BuildHolding in 2005, bringing her expertise in corporate finance and strategic planning. She has been instrumental in managing the group's acquisitions and financial growth.",
          bg: "Мария се присъедини към BuildHolding през 2005 г., внасяйки своя експертен опит в корпоративните финанси и стратегическото планиране. Тя изигра важна роля в управлението на придобиванията на групата и финансовия растеж.",
          ru: "Мария присоединилась к BuildHolding в 2005 году, привнеся свой опыт в области корпоративных финансов и стратегического планирования. Она сыграла важную роль в управлении приобретениями и финансовым ростом группы."
        }
      },
      {
        name: "Stefan Dimitrov",
        image: "/images/team/cto.jpg",
        position: {
          en: "Chief Technical Officer",
          bg: "Главен технически директор",
          ru: "Технический директор"
        },
        bio: {
          en: "Stefan oversees all technical aspects of BuildHolding's operations. With a background in civil engineering and smart building technologies, he drives innovation across all our projects.",
          bg: "Стефан наблюдава всички технически аспекти на дейността на BuildHolding. С опит в гражданското инженерство и технологиите за интелигентни сгради, той движи иновациите във всички наши проекти.",
          ru: "Стефан курирует все технические аспекты деятельности BuildHolding. Имея опыт в области гражданского строительства и технологий умных зданий, он внедряет инновации во всех наших проектах."
        }
      }
    ]
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
