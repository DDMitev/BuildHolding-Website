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

const timelineSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  title: {
    type: multiLanguageText,
    required: [true, 'Timeline event title is required']
  },
  description: {
    type: multiLanguageText,
    required: [true, 'Timeline event description is required']
  },
  icon: {
    type: String,
    default: 'fas fa-building'
  },
  color: {
    type: String,
    default: '#0056b3'
  },
  image: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Default sort by year ascending
timelineSchema.pre('find', function() {
  this.sort({ year: 1 });
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;
