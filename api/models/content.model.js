const mongoose = require('mongoose');

// Multi-language content block
const contentBlockSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String }
}, { _id: false });

// Content media item schema
const mediaItemSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Media URL is required']
  },
  alt: {
    type: String
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image'
  }
}, { _id: true });

const pageContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'Page identifier is required'],
    enum: ['home', 'about', 'contact', 'projects', 'ourHolding']
  },
  section: {
    type: String,
    required: [true, 'Section identifier is required']
  },
  content: {
    en: {
      type: contentBlockSchema,
      required: [true, 'English content is required']
    },
    bg: {
      type: contentBlockSchema,
      required: [true, 'Bulgarian content is required']
    },
    ru: {
      type: contentBlockSchema
    }
  },
  media: [mediaItemSchema],
  settings: {
    backgroundColor: {
      type: String
    },
    textColor: {
      type: String
    },
    layout: {
      type: String,
      enum: ['left', 'right', 'center', 'full']
    }
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a compound index for page and section
pageContentSchema.index({ page: 1, section: 1 }, { unique: true });

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;
