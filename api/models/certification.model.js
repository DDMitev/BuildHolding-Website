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

const certificationSchema = new mongoose.Schema({
  title: {
    type: multiLanguageText,
    required: [true, 'Certification title is required']
  },
  description: {
    type: multiLanguageText,
    required: [true, 'Certification description is required']
  },
  issuer: {
    type: String,
    required: [true, 'Certification issuer is required']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  expiryDate: {
    type: Date
  },
  image: {
    type: String,
    required: [true, 'Certification image is required']
  },
  category: {
    type: String,
    required: [true, 'Certification category is required']
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual to determine if certification is currently valid
certificationSchema.virtual('isValid').get(function() {
  if (!this.expiryDate) return true; // No expiry date means always valid
  return new Date(this.expiryDate) > new Date();
});

// Default sort by issue date descending (newest first)
certificationSchema.pre('find', function() {
  this.sort({ issueDate: -1 });
});

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;
