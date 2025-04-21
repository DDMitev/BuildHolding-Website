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

const mediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Media name is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Media URL is required']
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image'
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  dimensions: {
    width: Number,
    height: Number
  },
  alt: multiLanguageText,
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Text index for search functionality
mediaSchema.index({ 
  name: 'text',
  'alt.en': 'text',
  'alt.bg': 'text',
  'alt.ru': 'text',
  tags: 'text'
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
