const mongoose = require('mongoose');

// Multi-language text schema (for titles, descriptions, etc.)
const multiLanguageText = {
  en: {
    type: String,
    required: [true, 'English text is required']
  },
  bg: {
    type: String,
    required: [true, 'Bulgarian text is required']
  },
  ru: {
    type: String,
    default: ''
  }
};

// Image schema for project galleries
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  alt: multiLanguageText,
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { _id: true });

// Project schema
const projectSchema = new mongoose.Schema({
  title: {
    type: multiLanguageText,
    required: [true, 'Project title is required']
  },
  description: {
    type: multiLanguageText,
    required: [true, 'Project description is required']
  },
  shortDescription: {
    type: multiLanguageText,
    required: [true, 'Short description is required']
  },
  category: {
    type: multiLanguageText,
    required: [true, 'Category is required']
  },
  subcategory: {
    type: multiLanguageText
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'complete'],
    default: 'planned',
    required: [true, 'Status is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  images: [imageSchema],
  mainImageUrl: {
    type: String
  },
  location: {
    address: multiLanguageText,
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  specifications: {
    area: {
      total: {
        type: Number
      },
      unit: {
        type: String,
        default: 'm²'
      }
    },
    floors: {
      above: {
        type: Number,
        default: 0
      },
      below: {
        type: Number,
        default: 0
      }
    },
    parking: {
      spaces: {
        type: Number,
        default: 0
      },
      type: multiLanguageText
    },
    sustainability: {
      certification: {
        type: String
      },
      features: [multiLanguageText]
    }
  },
  features: [multiLanguageText],
  client: {
    name: multiLanguageText,
    logo: {
      type: String
    },
    testimonial: multiLanguageText
  },
  team: {
    architect: multiLanguageText,
    contractor: multiLanguageText,
    engineers: multiLanguageText
  },
  timeline: {
    planning: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      }
    },
    foundation: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      }
    },
    structure: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      }
    },
    facade: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      }
    },
    interiors: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      }
    },
    landscaping: {
      start: {
        type: Date
      },
      end: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      inProgress: {
        type: Boolean,
        default: false
      }
    },
    completion: {
      projected: {
        type: Date
      }
    }
  },
  budget: {
    currency: {
      type: String,
      default: 'EUR'
    },
    value: {
      type: Number
    }
  }
}, {
  timestamps: true
});

// Virtual for retrieving featured image
projectSchema.virtual('featuredImage').get(function() {
  const featuredImage = this.images.find(img => img.isFeatured);
  return featuredImage ? featuredImage.url : this.mainImageUrl || '';
});

// Add text index for search functionality
projectSchema.index({ 
  'title.en': 'text', 
  'title.bg': 'text', 
  'title.ru': 'text',
  'description.en': 'text', 
  'description.bg': 'text', 
  'description.ru': 'text'
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
