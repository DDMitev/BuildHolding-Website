/**
 * Home Content Service
 * Handles persistence and retrieval of home page content using localStorage
 */

const HOME_CONTENT_KEY = 'buildholding_home_content';

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

/**
 * Save home content to localStorage
 * @param {Object} content Home content object
 */
export const saveHomeContent = (content) => {
  try {
    const contentToSave = JSON.stringify(content);
    localStorage.setItem(HOME_CONTENT_KEY, contentToSave);
    return true;
  } catch (error) {
    console.error('Error saving home content:', error);
    return false;
  }
};

/**
 * Get home content from localStorage
 * @returns {Object} Home content object or default if not found
 */
export const getHomeContent = () => {
  try {
    const savedContent = localStorage.getItem(HOME_CONTENT_KEY);
    if (!savedContent) {
      return defaultHomeContent;
    }
    
    const parsedContent = JSON.parse(savedContent);
    
    // Ensure all required sections exist by merging with defaults
    return {
      ...defaultHomeContent,
      ...parsedContent,
      hero: {
        ...defaultHomeContent.hero,
        ...(parsedContent.hero || {})
      },
      about: {
        ...defaultHomeContent.about,
        ...(parsedContent.about || {})
      },
      featured: {
        ...defaultHomeContent.featured,
        ...(parsedContent.featured || {})
      },
      services: {
        ...defaultHomeContent.services,
        ...(parsedContent.services || {})
      },
      cta: {
        ...defaultHomeContent.cta,
        ...(parsedContent.cta || {})
      }
    };
  } catch (error) {
    console.error('Error retrieving home content:', error);
    return defaultHomeContent;
  }
};

export default {
  getHomeContent,
  saveHomeContent,
  defaultHomeContent
};
