const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/user.model');
const Project = require('../models/project.model');
const Partner = require('../models/partner.model');
const Client = require('../models/client.model');
const Timeline = require('../models/timeline.model');
const PageContent = require('../models/content.model');
const Media = require('../models/media.model');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@buildholding.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      email: 'admin@buildholding.com',
      password: hashedPassword,
      displayName: 'Admin User',
      role: 'admin'
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Import hardcoded projects data
const importProjects = async () => {
  try {
    // Check if projects exist
    const projectCount = await Project.countDocuments();
    
    if (projectCount > 0) {
      console.log(`${projectCount} projects already exist, skipping import`);
      return;
    }
    
    // Load hardcoded project data
    // For actual implementation, you would:
    // 1. Read from your frontend hardcoded-projects.js
    // 2. Convert to proper format for MongoDB
    // 3. Save images to uploads folder and update URLs
    
    // This is placeholder data based on your hardcoded-projects.js
    const projects = [
      {
        title: { 
          en: "Modern Office Building", 
          bg: "Модерна офис сграда", 
          ru: "Современное офисное здание" 
        },
        description: { 
          en: "A sleek new office complex with modern amenities and prime location in the heart of the business district. The building features a unique glass facade that maximizes natural light while maintaining energy efficiency.", 
          bg: "Елегантен нов офис комплекс с модерни удобства и първокласна локация в сърцето на бизнес квартала.", 
          ru: "Элегантный новый офисный комплекс с современными удобствами и первоклассным расположением в центре делового района." 
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
        status: "in-progress",
        featured: true,
        completionPercentage: 65,
        images: [
          {
            url: "/uploads/images/office1.jpg",
            alt: { 
              en: "Main facade of the office building", 
              bg: "Главна фасада на офис сградата", 
              ru: "Главный фасад офисного здания" 
            },
            isFeatured: true
          }
        ],
        location: {
          address: {
            en: "123 Business Avenue, Financial District, Sofia, Bulgaria",
            bg: "Бизнес Авеню 123, Финансов Квартал, София, България",
            ru: "Бизнес Авеню 123, Финансовый Квартал, София, Болгария"
          },
          coordinates: {
            lat: 42.697708,
            lng: 23.321868
          }
        }
      },
      {
        title: { 
          en: "Residential Complex Sunset", 
          bg: "Жилищен комплекс Сънсет", 
          ru: "Жилой комплекс Сансет" 
        },
        description: { 
          en: "A vibrant residential community with modern amenities and beautiful views.", 
          bg: "Живописна жилищна общност с модерни удобства.", 
          ru: "Яркий жилой комплекс с современными удобствами." 
        },
        shortDescription: { 
          en: "A vibrant residential community with modern amenities.",
          bg: "Живописна жилищна общност с модерни удобства.",
          ru: "Яркий жилой комплекс с современными удобствами."
        },
        category: { 
          en: "Residential", 
          bg: "Жилищно", 
          ru: "Жилое" 
        },
        status: "complete",
        featured: true,
        completionPercentage: 100,
        images: [
          {
            url: "/uploads/images/residential1.jpg",
            alt: { 
              en: "Residential Complex Sunset", 
              bg: "Жилищен комплекс Сънсет", 
              ru: "Жилой комплекс Сансет" 
            },
            isFeatured: true
          }
        ],
        location: {
          address: {
            en: "45 Sunset Boulevard, Lozenets, Sofia, Bulgaria",
            bg: "Булевард Залез 45, Лозенец, София, България",
            ru: "Бульвар Закат 45, Лозенец, София, Болгария"
          },
          coordinates: {
            lat: 42.675446,
            lng: 23.319557
          }
        }
      },
      {
        title: { 
          en: "Shopping Mall Plaza", 
          bg: "Мол Плаза", 
          ru: "Торговый центр Плаза" 
        },
        description: { 
          en: "A modern shopping mall with premium stores and entertainment options.", 
          bg: "Модерен търговски център с премиум магазини.", 
          ru: "Современный торговый центр с премиальными магазинами." 
        },
        shortDescription: { 
          en: "A modern shopping mall with premium stores.",
          bg: "Модерен търговски център с премиум магазини.",
          ru: "Современный торговый центр с премиальными магазинами."
        },
        category: { 
          en: "Commercial", 
          bg: "Търговско", 
          ru: "Коммерческое" 
        },
        status: "planned",
        featured: true,
        completionPercentage: 0,
        images: [
          {
            url: "/uploads/images/mall1.jpg",
            alt: { 
              en: "Shopping Mall Plaza", 
              bg: "Мол Плаза", 
              ru: "Торговый центр Плаза" 
            },
            isFeatured: true
          }
        ],
        location: {
          address: {
            en: "78 Shopping Avenue, Sofia, Bulgaria",
            bg: "Булевард Шопинг 78, София, България",
            ru: "Бульвар Шоппинг 78, София, Болгария"
          },
          coordinates: {
            lat: 42.698060,
            lng: 23.322140
          }
        }
      }
    ];
    
    // Insert projects
    await Project.insertMany(projects);
    console.log(`${projects.length} projects imported successfully`);
  } catch (error) {
    console.error('Error importing projects:', error);
  }
};

// Import timeline milestones
const importTimeline = async () => {
  try {
    // Check if timeline entries exist
    const timelineCount = await Timeline.countDocuments();
    
    if (timelineCount > 0) {
      console.log(`${timelineCount} timeline entries already exist, skipping import`);
      return;
    }
    
    // Sample timeline data
    const timelineEvents = [
      {
        year: 1995,
        title: {
          en: "Company Founded",
          bg: "Основаване на компанията",
          ru: "Основание компании"
        },
        description: {
          en: "BuildHolding was established as a small construction company in Sofia.",
          bg: "BuildHolding е основана като малка строителна компания в София.",
          ru: "BuildHolding была основана как небольшая строительная компания в Софии."
        },
        icon: "fas fa-flag",
        color: "#0056b3",
        featured: true
      },
      {
        year: 2005,
        title: {
          en: "First Major Project",
          bg: "Първи голям проект",
          ru: "Первый крупный проект"
        },
        description: {
          en: "Completed our first major commercial building in the heart of Sofia.",
          bg: "Завършихме първата си голяма търговска сграда в центъра на София.",
          ru: "Завершили наше первое крупное коммерческое здание в центре Софии."
        },
        icon: "fas fa-building",
        color: "#ff7722",
        featured: true
      },
      {
        year: 2012,
        title: {
          en: "International Expansion",
          bg: "Международно разширяване",
          ru: "Международное расширение"
        },
        description: {
          en: "Expanded operations to neighboring countries in Eastern Europe.",
          bg: "Разширихме дейността си към съседни страни в Източна Европа.",
          ru: "Расширили деятельность на соседние страны в Восточной Европе."
        },
        icon: "fas fa-globe",
        color: "#28a745",
        featured: true
      },
      {
        year: 2020,
        title: {
          en: "Sustainability Initiative",
          bg: "Инициатива за устойчивост",
          ru: "Инициатива по устойчивому развитию"
        },
        description: {
          en: "Launched comprehensive sustainability program for all new projects.",
          bg: "Стартирахме цялостна програма за устойчивост за всички нови проекти.",
          ru: "Запустили комплексную программу устойчивого развития для всех новых проектов."
        },
        icon: "fas fa-leaf",
        color: "#28a745",
        featured: true
      }
    ];
    
    // Insert timeline events
    await Timeline.insertMany(timelineEvents);
    console.log(`${timelineEvents.length} timeline events imported successfully`);
  } catch (error) {
    console.error('Error importing timeline events:', error);
  }
};

// Import partners data
const importPartners = async () => {
  try {
    // Check if partners exist
    const partnerCount = await Partner.countDocuments();
    
    if (partnerCount > 0) {
      console.log(`${partnerCount} partners already exist, skipping import`);
      return;
    }
    
    // Sample partners data
    const partners = [
      {
        name: {
          en: "ArchTech Solutions",
          bg: "АркТех Солюшънс",
          ru: "АркТех Солюшнс"
        },
        description: {
          en: "Leading architectural design firm specializing in modern commercial buildings.",
          bg: "Водеща архитектурна фирма, специализирана в модерни търговски сгради.",
          ru: "Ведущая архитектурная фирма, специализирующаяся на современных коммерческих зданиях."
        },
        logo: "/uploads/images/partner1.jpg",
        website: "https://archtech.example.com",
        featured: true,
        category: "Architecture"
      },
      {
        name: {
          en: "EcoConstruct Ltd",
          bg: "ЕкоКонструкт ООД",
          ru: "ЭкоКонструкт ООО"
        },
        description: {
          en: "Sustainable building materials provider for eco-friendly construction.",
          bg: "Доставчик на устойчиви строителни материали за екологично строителство.",
          ru: "Поставщик экологически чистых строительных материалов."
        },
        logo: "/uploads/images/partner2.jpg",
        website: "https://ecoconstruct.example.com",
        featured: true,
        category: "Materials"
      },
      {
        name: {
          en: "Global Investments Group",
          bg: "Глобал Инвестмънтс Груп",
          ru: "Глобал Инвестментс Групп"
        },
        description: {
          en: "International investment group specializing in real estate development.",
          bg: "Международна инвестиционна група, специализирана в недвижими имоти.",
          ru: "Международная инвестиционная группа, специализирующаяся на недвижимости."
        },
        logo: "/uploads/images/partner3.jpg",
        website: "https://globalinv.example.com",
        featured: true,
        category: "Finance"
      }
    ];
    
    // Insert partners
    await Partner.insertMany(partners);
    console.log(`${partners.length} partners imported successfully`);
  } catch (error) {
    console.error('Error importing partners:', error);
  }
};

// Import clients data
const importClients = async () => {
  try {
    // Check if clients exist
    const clientCount = await Client.countDocuments();
    
    if (clientCount > 0) {
      console.log(`${clientCount} clients already exist, skipping import`);
      return;
    }
    
    // Sample clients data
    const clients = [
      {
        name: {
          en: "Sofia Tech Park",
          bg: "София Тех Парк",
          ru: "София Тех Парк"
        },
        description: {
          en: "Innovation and technology center hosting leading tech companies.",
          bg: "Иновационен и технологичен център, домакин на водещи технологични компании.",
          ru: "Инновационный и технологический центр, принимающий ведущие технологические компании."
        },
        logo: "/uploads/images/client1.jpg",
        website: "https://sofiatechpark.example.com",
        featured: true,
        industry: "Technology",
        testimonial: {
          text: {
            en: "BuildHolding delivered our complex project on time and within budget.",
            bg: "BuildHolding изпълни сложния ни проект навреме и в рамките на бюджета.",
            ru: "BuildHolding выполнила наш сложный проект вовремя и в рамках бюджета."
          },
          author: "Maria Petrova",
          position: "CEO"
        }
      },
      {
        name: {
          en: "Paradise Mall",
          bg: "Мол Парадайс",
          ru: "Торговый центр Парадайс"
        },
        description: {
          en: "Premier shopping destination with over 200 retail outlets and entertainment venues.",
          bg: "Водеща шопинг дестинация с над 200 магазина и места за забавление.",
          ru: "Ведущее место для шопинга с более чем 200 магазинами и местами развлечений."
        },
        logo: "/uploads/images/client2.jpg",
        website: "https://paradisemall.example.com",
        featured: true,
        industry: "Retail",
        testimonial: {
          text: {
            en: "The quality of construction exceeded our expectations.",
            bg: "Качеството на строителството надмина очакванията ни.",
            ru: "Качество строительства превзошло наши ожидания."
          },
          author: "Stefan Dimitrov",
          position: "Operations Director"
        }
      },
      {
        name: {
          en: "City Residences",
          bg: "Сити Резидънс",
          ru: "Сити Резиденс"
        },
        description: {
          en: "Luxury residential property developer with projects across Bulgaria.",
          bg: "Разработчик на луксозни жилищни имоти с проекти в цяла България.",
          ru: "Разработчик элитной жилой недвижимости с проектами по всей Болгарии."
        },
        logo: "/uploads/images/client3.jpg",
        website: "https://cityresidences.example.com",
        featured: true,
        industry: "Real Estate",
        testimonial: {
          text: {
            en: "Professional team that understands modern residential needs.",
            bg: "Професионален екип, който разбира съвременните жилищни нужди.",
            ru: "Профессиональная команда, понимающая современные жилищные потребности."
          },
          author: "Elena Ivanova",
          position: "Development Manager"
        }
      }
    ];
    
    // Insert clients
    await Client.insertMany(clients);
    console.log(`${clients.length} clients imported successfully`);
  } catch (error) {
    console.error('Error importing clients:', error);
  }
};

// Create uploads directory structure
const createUploadsStructure = async () => {
  try {
    const baseDir = process.env.UPLOAD_PATH || './uploads';
    
    // Create main uploads directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    // Create subdirectories
    const subdirs = ['images', 'videos', 'documents'];
    
    for (const dir of subdirs) {
      const path = `${baseDir}/${dir}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    }
    
    console.log('Uploads directory structure created successfully');
  } catch (error) {
    console.error('Error creating uploads directory structure:', error);
  }
};

// Run all seed functions
const seedAll = async () => {
  try {
    // Create directory structure
    await createUploadsStructure();
    
    // Seed data
    await createAdminUser();
    await importProjects();
    await importTimeline();
    await importPartners();
    await importClients();
    
    console.log('All seed operations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seed operations:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAll();
