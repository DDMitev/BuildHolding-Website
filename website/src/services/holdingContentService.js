/**
 * Holding Content Service
 * Handles persistence and retrieval of our holding page content using localStorage
 */

const HOLDING_CONTENT_KEY = 'buildholding_our_holding_content';

// Default holding content structure with multilingual support
const defaultHoldingContent = {
  hero: {
    title: {
      en: "Our Holding",
      bg: "Нашият Холдинг",
      ru: "Наш Холдинг"
    },
    subtitle: {
      en: "Building Excellence Since 1995",
      bg: "Изграждаме Съвършенство от 1995",
      ru: "Строим Совершенство с 1995 года"
    },
    backgroundImage: "/images/hero-holding.jpg"
  },
  overview: {
    title: {
      en: "Company Overview",
      bg: "Преглед на компанията",
      ru: "Обзор компании"
    },
    description: {
      en: "BuildHolding is a leading construction company with over 25 years of experience delivering high-quality projects across Bulgaria and Eastern Europe. We specialize in commercial, residential, and industrial construction with a focus on sustainability and innovation.",
      bg: "BuildHolding е водеща строителна компания с над 25 години опит в реализирането на висококачествени проекти в цяла България и Източна Европа. Специализираме в търговско, жилищно и индустриално строителство с фокус върху устойчивост и иновации.",
      ru: "BuildHolding - ведущая строительная компания с более чем 25-летним опытом реализации высококачественных проектов по всей Болгарии и Восточной Европе. Мы специализируемся на коммерческом, жилом и промышленном строительстве с акцентом на устойчивость и инновации."
    },
    image: "https://picsum.photos/seed/holding/700/500"
  },
  values: {
    title: {
      en: "Our Core Values",
      bg: "Нашите Основни Ценности",
      ru: "Наши Основные Ценности"
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
          en: "We conduct our business with honesty, transparency, and ethical practices in all our relationships.",
          bg: "Ние водим бизнеса си с честност, прозрачност и етични практики във всички наши взаимоотношения.",
          ru: "Мы ведем бизнес честно, прозрачно и этично во всех наших делах."
        }
      },
      {
        icon: "fas fa-medal",
        title: {
          en: "Quality",
          bg: "Качество",
          ru: "Качество"
        },
        description: {
          en: "We are dedicated to excellence and the highest standards in every project we undertake.",
          bg: "Ние сме отдадени на съвършенството и най-високите стандарти във всеки проект, който предприемаме.",
          ru: "Мы стремимся к совершенству и высочайшим стандартам в каждом проекте, который мы выполняем."
        }
      },
      {
        icon: "fas fa-lightbulb",
        title: {
          en: "Innovation",
          bg: "Иновация",
          ru: "Инновации"
        },
        description: {
          en: "We constantly seek new technologies and methods to improve our construction processes.",
          bg: "Ние постоянно търсим нови технологии и методи за подобряване на нашите строителни процеси.",
          ru: "Мы постоянно ищем новые технологии и методы для улучшения наших строительных процессов."
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
          en: "We build with the future in mind, minimizing environmental impact and maximizing efficiency.",
          bg: "Ние строим с мисъл за бъдещето, минимизирайки въздействието върху околната среда и максимизирайки ефективността.",
          ru: "Мы строим с мыслью о будущем, минимизируя воздействие на окружающую среду и максимизируя эффективность."
        }
      }
    ]
  },
  stats: {
    title: {
      en: "Company Statistics",
      bg: "Статистика на компанията",
      ru: "Статистика Компании"
    },
    items: [
      {
        number: 25,
        label: {
          en: "Years of experience",
          bg: "Години опит",
          ru: "Лет опыта"
        }
      },
      {
        number: 120,
        label: {
          en: "Completed projects",
          bg: "Завършени проекти",
          ru: "Завершенных проектов"
        }
      },
      {
        number: 85,
        label: {
          en: "Happy clients",
          bg: "Доволни клиенти",
          ru: "Довольных клиентов"
        }
      },
      {
        number: 150,
        label: {
          en: "Professional team members",
          bg: "Професионални членове на екипа",
          ru: "Профессиональных членов команды"
        }
      }
    ]
  },
  tabs: {
    mission: {
      title: {
        en: "Our Mission",
        bg: "Нашата Мисия",
        ru: "Наша Миссия"
      },
      content: {
        en: "At BuildHolding, our mission is to create innovative, sustainable structures that stand the test of time. We believe in combining cutting-edge technology with traditional craftsmanship to deliver exceptional value to our clients and communities.",
        bg: "В BuildHolding нашата мисия е да създаваме иновативни, устойчиви структури, които издържат на теста на времето. Вярваме в съчетаването на най-новите технологии с традиционните занаяти, за да предоставим изключителна стойност на нашите клиенти и общности.",
        ru: "В BuildHolding наша миссия - создавать инновационные, устойчивые структуры, которые выдерживают испытание временем. Мы верим в сочетание передовых технологий с традиционным мастерством, чтобы предоставить исключительную ценность нашим клиентам и сообществам."
      }
    },
    vision: {
      title: {
        en: "Our Vision",
        bg: "Нашата Визия",
        ru: "Наше Видение"
      },
      content: {
        en: "We aspire to be the most trusted construction company in Eastern Europe, known for our uncompromising quality, innovative approaches, and contribution to sustainable development. We aim to create buildings that enrich lives, respect the environment, and shape the future of urban landscapes.",
        bg: "Стремим се да бъдем най-доверената строителна компания в Източна Европа, известна с нашето безкомпромисно качество, иновативни подходи и принос към устойчивото развитие. Целим да създаваме сгради, които обогатяват живота, уважават околната среда и оформят бъдещето на градските пейзажи.",
        ru: "Мы стремимся быть самой надежной строительной компанией в Восточной Европе, известной нашим бескомпромиссным качеством, инновационными подходами и вкладом в устойчивое развитие. Мы стремимся создавать здания, которые обогащают жизнь, уважают окружающую среду и формируют будущее городских ландшафтов."
      }
    },
    approach: {
      title: {
        en: "Our Approach",
        bg: "Нашият Подход",
        ru: "Наш Подход"
      },
      content: {
        en: "Our approach combines traditional construction excellence with modern technologies and sustainable practices. We begin each project with thorough planning, continue with meticulous execution, and finish with rigorous quality control. Our collaborative methodology ensures that clients are involved at every stage, from concept to completion.",
        bg: "Нашият подход съчетава традиционно строително съвършенство с модерни технологии и устойчиви практики. Започваме всеки проект с щателно планиране, продължаваме с прецизно изпълнение и завършваме с строг контрол на качеството. Нашата методология на сътрудничество гарантира, че клиентите са включени на всеки етап, от концепцията до завършването.",
        ru: "Наш подход сочетает традиционное строительное мастерство с современными технологиями и устойчивыми практиками. Мы начинаем каждый проект с тщательного планирования, продолжаем с тщательным исполнением и заканчиваем строгим контролем качества. Наша методология сотрудничества гарантирует, что клиенты вовлечены на каждом этапе, от концепции до завершения."
      }
    },
    history: {
      title: {
        en: "Our History",
        bg: "Нашата История",
        ru: "Наша История"
      },
      content: {
        en: "Founded in 1995, BuildHolding began as a small construction firm focused on residential properties in Sofia. Through our commitment to quality and client satisfaction, we quickly expanded to commercial and industrial projects. Key milestones include our first international project in 2005, becoming certified in sustainable construction in 2010, and the establishment of our specialized divisions for different construction sectors in 2015.",
        bg: "Основана през 1995 г., BuildHolding започна като малка строителна фирма, фокусирана върху жилищни имоти в София. Чрез нашия ангажимент към качеството и удовлетвореността на клиентите, ние бързо се разширихме към търговски и индустриални проекти. Ключови етапи включват първия ни международен проект през 2005 г., сертифицирането в устойчиво строителство през 2010 г. и създаването на нашите специализирани подразделения за различни строителни сектори през 2015 г.",
        ru: "Основанная в 1995 году, BuildHolding начинала как небольшая строительная фирма, специализирующаяся на жилой недвижимости в Софии. Благодаря нашей приверженности качеству и удовлетворенности клиентов, мы быстро расширились до коммерческих и промышленных проектов. Ключевые этапы включают наш первый международный проект в 2005 году, сертификацию в области устойчивого строительства в 2010 году и создание наших специализированных подразделений для различных строительных секторов в 2015 году."
      }
    }
  },
  team: {
    title: {
      en: "Our Leadership Team",
      bg: "Нашият Ръководен Екип",
      ru: "Наша Команда Руководства"
    },
    members: [
      {
        name: "Nikolai Petrov",
        position: {
          en: "Chief Executive Officer",
          bg: "Главен Изпълнителен Директор",
          ru: "Генеральный Директор"
        },
        bio: {
          en: "With over 30 years in construction management, Nikolai brings unparalleled expertise and vision to BuildHolding. He holds a Master's in Civil Engineering and has led some of the most complex construction projects in Eastern Europe.",
          bg: "С над 30 години опит в строителния мениджмънт, Николай внася ненадминат опит и визия в BuildHolding. Той притежава магистърска степен по строително инженерство и е ръководил някои от най-сложните строителни проекти в Източна Европа.",
          ru: "С более чем 30-летним опытом в строительном менеджменте, Николай привносит непревзойденный опыт и видение в BuildHolding. Он имеет степень магистра строительного инженера и руководил некоторыми из самых сложных строительных проектов в Восточной Европе."
        },
        image: "https://picsum.photos/seed/ceo/300/300"
      },
      {
        name: "Elena Dimitrova",
        position: {
          en: "Chief Operations Officer",
          bg: "Главен Оперативен Директор",
          ru: "Главный Операционный Директор"
        },
        bio: {
          en: "Elena specializes in optimizing construction operations and supply chain management. Her innovative approach has significantly improved construction efficiency while maintaining the highest quality standards.",
          bg: "Елена специализира в оптимизиране на строителните операции и управление на веригата за доставки. Нейният иновативен подход значително е подобрил ефективността на строителството, като същевременно поддържа най-високите стандарти за качество.",
          ru: "Елена специализируется на оптимизации строительных операций и управлении цепочками поставок. Ее инновационный подход значительно улучшил эффективность строительства, сохраняя при этом высочайшие стандарты качества."
        },
        image: "https://picsum.photos/seed/coo/300/300"
      },
      {
        name: "Martin Stoichev",
        position: {
          en: "Chief Technical Officer",
          bg: "Главен Технически Директор",
          ru: "Главный Технический Директор"
        },
        bio: {
          en: "Martin leads our technical innovation department, integrating cutting-edge construction technologies. He has a background in structural engineering and sustainable building systems.",
          bg: "Мартин ръководи нашия отдел за технически иновации, интегрирайки най-съвременни строителни технологии. Той има опит в конструктивното инженерство и устойчивите строителни системи.",
          ru: "Мартин возглавляет наш отдел технических инноваций, интегрируя передовые строительные технологии. Он имеет опыт в области структурного инженерства и устойчивых строительных систем."
        },
        image: "https://picsum.photos/seed/cto/300/300"
      }
    ]
  }
};

/**
 * Save holding content to localStorage
 * @param {Object} content Holding content object
 */
export const saveHoldingContent = (content) => {
  try {
    const contentToSave = JSON.stringify(content);
    localStorage.setItem(HOLDING_CONTENT_KEY, contentToSave);
    return true;
  } catch (error) {
    console.error('Error saving holding content:', error);
    return false;
  }
};

/**
 * Get holding content from localStorage
 * @returns {Object} Holding content object or default if not found
 */
export const getHoldingContent = () => {
  try {
    const savedContent = localStorage.getItem(HOLDING_CONTENT_KEY);
    if (!savedContent) {
      return defaultHoldingContent;
    }
    
    const parsedContent = JSON.parse(savedContent);
    
    // Ensure all required sections exist by merging with defaults
    return {
      ...defaultHoldingContent,
      ...parsedContent,
      hero: {
        ...defaultHoldingContent.hero,
        ...(parsedContent.hero || {})
      },
      overview: {
        ...defaultHoldingContent.overview,
        ...(parsedContent.overview || {})
      },
      values: {
        ...defaultHoldingContent.values,
        ...(parsedContent.values || {})
      },
      stats: {
        ...defaultHoldingContent.stats,
        ...(parsedContent.stats || {})
      },
      tabs: {
        ...defaultHoldingContent.tabs,
        ...(parsedContent.tabs || {})
      },
      team: {
        ...defaultHoldingContent.team,
        ...(parsedContent.team || {})
      }
    };
  } catch (error) {
    console.error('Error retrieving holding content:', error);
    return defaultHoldingContent;
  }
};

export default {
  getHoldingContent,
  saveHoldingContent,
  defaultHoldingContent
};
