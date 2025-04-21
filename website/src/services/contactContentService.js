/**
 * Contact Content Service
 * Handles persistence and retrieval of contact page content using localStorage
 */

const CONTACT_CONTENT_KEY = 'buildholding_contact_content';

// Default contact content structure with multilingual support
const defaultContactContent = {
  hero: {
    title: {
      en: "Contact Us",
      bg: "Свържете се с нас",
      ru: "Связаться с нами"
    },
    subtitle: {
      en: "Get in touch with our team for any questions or inquiries",
      bg: "Свържете се с нашия екип за всякакви въпроси или запитвания",
      ru: "Свяжитесь с нашей командой по любым вопросам или запросам"
    },
    backgroundImage: "/images/hero-contact.jpg"
  },
  contactInfo: {
    title: {
      en: "Contact Information",
      bg: "Информация за контакт",
      ru: "Контактная информация"
    },
    description: {
      en: "Reach out to us using any of the contact methods below. Our team is ready to assist you with any inquiries.",
      bg: "Свържете се с нас, използвайки някой от методите за контакт по-долу. Нашият екип е готов да ви помогне с всякакви запитвания.",
      ru: "Свяжитесь с нами, используя любой из способов связи ниже. Наша команда готова помочь вам с любыми вопросами."
    },
    mainOffice: {
      title: {
        en: "Main Office",
        bg: "Централен офис",
        ru: "Главный офис"
      },
      address: {
        en: "123 Construction Blvd, Sofia 1000, Bulgaria",
        bg: "бул. Строителство 123, София 1000, България",
        ru: "123 бульвар Строительства, София 1000, Болгария"
      },
      phone: "+359 2 123 4567",
      email: "info@buildholding.com",
      hours: {
        en: "Monday - Friday: 9AM - 6PM",
        bg: "Понеделник - Петък: 9:00 - 18:00",
        ru: "Понедельник - Пятница: 9:00 - 18:00"
      }
    },
    regionalOffices: [
      {
        city: {
          en: "Plovdiv",
          bg: "Пловдив",
          ru: "Пловдив"
        },
        address: {
          en: "45 Regional St, Plovdiv 4000, Bulgaria",
          bg: "ул. Регионална 45, Пловдив 4000, България",
          ru: "45 улица Региональная, Пловдив 4000, Болгария"
        },
        phone: "+359 32 987 6543",
        email: "plovdiv@buildholding.com"
      },
      {
        city: {
          en: "Varna",
          bg: "Варна",
          ru: "Варна"
        },
        address: {
          en: "78 Sea View Ave, Varna 9000, Bulgaria",
          bg: "бул. Морски изглед 78, Варна 9000, България",
          ru: "78 проспект Морской вид, Варна 9000, Болгария"
        },
        phone: "+359 52 765 4321",
        email: "varna@buildholding.com"
      }
    ],
    socialMedia: {
      facebook: "https://facebook.com/buildholding",
      linkedin: "https://linkedin.com/company/buildholding",
      instagram: "https://instagram.com/buildholding",
      twitter: "https://twitter.com/buildholding"
    }
  },
  contactForm: {
    title: {
      en: "Send Us a Message",
      bg: "Изпратете ни съобщение",
      ru: "Отправьте нам сообщение"
    },
    description: {
      en: "Fill out the form below, and we'll get back to you as soon as possible.",
      bg: "Попълнете формуляра по-долу и ние ще се свържем с вас възможно най-скоро.",
      ru: "Заполните форму ниже, и мы свяжемся с вами как можно скорее."
    },
    nameLabel: {
      en: "Full Name",
      bg: "Пълно име",
      ru: "Полное имя"
    },
    emailLabel: {
      en: "Email Address",
      bg: "Имейл адрес",
      ru: "Электронная почта"
    },
    phoneLabel: {
      en: "Phone Number (Optional)",
      bg: "Телефонен номер (По избор)",
      ru: "Номер телефона (По желанию)"
    },
    subjectLabel: {
      en: "Subject",
      bg: "Тема",
      ru: "Тема"
    },
    messageLabel: {
      en: "Your Message",
      bg: "Вашето съобщение",
      ru: "Ваше сообщение"
    },
    submitButton: {
      en: "Send Message",
      bg: "Изпрати съобщение",
      ru: "Отправить сообщение"
    },
    successMessage: {
      en: "Thank you for your message! We will get back to you shortly.",
      bg: "Благодарим за вашето съобщение! Ще се свържем с вас скоро.",
      ru: "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время."
    }
  },
  map: {
    title: {
      en: "Our Location",
      bg: "Нашето местоположение",
      ru: "Наше местоположение"
    },
    description: {
      en: "Visit our headquarters in the heart of Sofia.",
      bg: "Посетете нашата централа в сърцето на София.",
      ru: "Посетите нашу штаб-квартиру в центре Софии."
    },
    coordinates: {
      lat: 42.697708,
      lng: 23.321868
    },
    zoom: 15,
    markerTitle: {
      en: "BuildHolding HQ",
      bg: "BuildHolding Централа",
      ru: "BuildHolding Центральный офис"
    }
  },
  faq: {
    title: {
      en: "Frequently Asked Questions",
      bg: "Често задавани въпроси",
      ru: "Часто задаваемые вопросы"
    },
    description: {
      en: "Find answers to common questions about our services and projects.",
      bg: "Намерете отговори на често задавани въпроси относно нашите услуги и проекти.",
      ru: "Найдите ответы на часто задаваемые вопросы о наших услугах и проектах."
    },
    items: [
      {
        question: {
          en: "What types of projects does BuildHolding specialize in?",
          bg: "В какви видове проекти се специализира BuildHolding?",
          ru: "В каких типах проектов специализируется BuildHolding?"
        },
        answer: {
          en: "BuildHolding specializes in diverse construction projects including residential buildings, industrial facilities, solar parks, and water treatment plants across Bulgaria and Eastern Europe.",
          bg: "BuildHolding се специализира в разнообразни строителни проекти, включително жилищни сгради, индустриални съоръжения, соларни паркове и пречиствателни станции в цяла България и Източна Европа.",
          ru: "BuildHolding специализируется на различных строительных проектах, включая жилые здания, промышленные объекты, солнечные парки и водоочистные сооружения по всей Болгарии и Восточной Европе."
        }
      },
      {
        question: {
          en: "How can I request a quote for my construction project?",
          bg: "Как мога да поискам оферта за моя строителен проект?",
          ru: "Как я могу запросить смету для моего строительного проекта?"
        },
        answer: {
          en: "You can request a quote by filling out our contact form with details about your project requirements, or by calling our main office. Our team will get back to you within 2 business days to discuss your project needs.",
          bg: "Можете да поискате оферта, като попълните нашия контактен формуляр с подробности за изискванията на вашия проект, или като се обадите в централния ни офис. Нашият екип ще се свърже с вас в рамките на 2 работни дни, за да обсъди нуждите на вашия проект.",
          ru: "Вы можете запросить смету, заполнив нашу контактную форму с деталями о требованиях вашего проекта, или позвонив в наш главный офис. Наша команда свяжется с вами в течение 2 рабочих дней, чтобы обсудить потребности вашего проекта."
        }
      },
      {
        question: {
          en: "What is your typical project timeline?",
          bg: "Какъв е типичният срок за изпълнение на проект?",
          ru: "Каковы типичные сроки выполнения проекта?"
        },
        answer: {
          en: "Project timelines vary based on complexity and scope. Residential projects typically take 12-18 months, industrial facilities 18-24 months, and specialized projects like solar parks can range from 6-12 months. We provide detailed timelines during the initial consultation phase.",
          bg: "Сроковете на проектите варират според сложността и обхвата. Жилищните проекти обикновено отнемат 12-18 месеца, индустриалните съоръжения 18-24 месеца, а специализираните проекти като соларни паркове могат да варират от 6-12 месеца. Предоставяме подробни срокове по време на първоначалната фаза на консултация.",
          ru: "Сроки проектов варьируются в зависимости от сложности и масштаба. Жилые проекты обычно занимают 12-18 месяцев, промышленные объекты 18-24 месяца, а специализированные проекты, такие как солнечные парки, могут занимать от 6 до 12 месяцев. Мы предоставляем подробные сроки во время начальной фазы консультаций."
        }
      }
    ]
  }
};

/**
 * Save contact content to localStorage
 * @param {Object} content Contact content object
 */
export const saveContactContent = (content) => {
  try {
    const contentToSave = JSON.stringify(content);
    localStorage.setItem(CONTACT_CONTENT_KEY, contentToSave);
    return true;
  } catch (error) {
    console.error('Error saving contact content:', error);
    return false;
  }
};

/**
 * Get contact content from localStorage
 * @returns {Object} Contact content object or default if not found
 */
export const getContactContent = () => {
  try {
    const savedContent = localStorage.getItem(CONTACT_CONTENT_KEY);
    if (!savedContent) {
      return defaultContactContent;
    }
    
    const parsedContent = JSON.parse(savedContent);
    
    // Ensure all required sections exist by merging with defaults
    return {
      ...defaultContactContent,
      ...parsedContent,
      hero: {
        ...defaultContactContent.hero,
        ...(parsedContent.hero || {})
      },
      contactInfo: {
        ...defaultContactContent.contactInfo,
        ...(parsedContent.contactInfo || {}),
        mainOffice: {
          ...defaultContactContent.contactInfo.mainOffice,
          ...(parsedContent.contactInfo?.mainOffice || {})
        },
        regionalOffices: parsedContent.contactInfo?.regionalOffices || defaultContactContent.contactInfo.regionalOffices,
        socialMedia: {
          ...defaultContactContent.contactInfo.socialMedia,
          ...(parsedContent.contactInfo?.socialMedia || {})
        }
      },
      contactForm: {
        ...defaultContactContent.contactForm,
        ...(parsedContent.contactForm || {})
      },
      map: {
        ...defaultContactContent.map,
        ...(parsedContent.map || {}),
        coordinates: {
          ...defaultContactContent.map.coordinates,
          ...(parsedContent.map?.coordinates || {})
        }
      },
      faq: {
        ...defaultContactContent.faq,
        ...(parsedContent.faq || {}),
        items: parsedContent.faq?.items || defaultContactContent.faq.items
      }
    };
  } catch (error) {
    console.error('Error retrieving contact content:', error);
    return defaultContactContent;
  }
};

export default {
  getContactContent,
  saveContactContent,
  defaultContactContent
};
