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
const defaultHomeContent = {
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
const defaultContactContent = {
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
const defaultHoldingContent = {
  header: {
    title: {
      en: "Our Holding Structure",
      bg: "Структура на холдинга",
      ru: "Структура холдинга"
    },
    subtitle: {
      en: "A family of companies working together to deliver excellence",
      bg: "Семейство от компании, работещи заедно за постигане на съвършенство",
      ru: "Семья компаний, работающих вместе для достижения совершенства"
    }
  },
  description: {
    en: "BuildHolding brings together specialized companies across the construction industry to provide a complete range of services from initial planning to project completion.",
    bg: "BuildHolding обединява специализирани компании в строителната индустрия, за да предостави пълен спектър от услуги от първоначалното планиране до завършването на проекта.",
    ru: "BuildHolding объединяет специализированные компании строительной отрасли, чтобы предоставить полный спектр услуг от первоначального планирования до завершения проекта."
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
        header: {
          ...defaultHoldingContent.header,
          ...(data.header || {})
        },
        structure: {
          ...defaultHoldingContent.structure,
          ...(data.structure || {})
        },
        values: {
          ...defaultHoldingContent.values,
          ...(data.values || {})
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

export default {
  getHomeContent,
  saveHomeContent,
  getContactContent,
  saveContactContent,
  getHoldingContent,
  saveHoldingContent,
  migrateLocalStorageToFirestore,
  defaultHomeContent,
  defaultContactContent,
  defaultHoldingContent
};
