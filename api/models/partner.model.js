const mongoose = require('mongoose');

// Multi-language text schema
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

const partnerSchema = new mongoose.Schema({
  name: {
    type: multiLanguageText,
    required: [true, 'Partner name is required']
  },
  description: {
    type: multiLanguageText,
    required: [true, 'Partner description is required']
  },
  logo: {
    type: String,
    required: [true, 'Logo image URL is required']
  },
  website: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Partner category is required']
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text index for search functionality
partnerSchema.index({ 
  'name.en': 'text', 
  'name.bg': 'text', 
  'name.ru': 'text',
  'description.en': 'text', 
  'description.bg': 'text', 
  'description.ru': 'text'
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
