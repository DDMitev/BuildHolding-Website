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

const clientSchema = new mongoose.Schema({
  name: {
    type: multiLanguageText,
    required: [true, 'Client name is required']
  },
  description: {
    type: multiLanguageText,
    required: [true, 'Client description is required']
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
  industry: {
    type: String,
    required: [true, 'Client industry is required']
  },
  testimonial: {
    text: multiLanguageText,
    author: {
      type: String
    },
    position: {
      type: String
    }
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text index for search functionality
clientSchema.index({ 
  'name.en': 'text', 
  'name.bg': 'text', 
  'name.ru': 'text',
  'description.en': 'text', 
  'description.bg': 'text', 
  'description.ru': 'text'
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
