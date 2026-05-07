const mongoose = require('mongoose');

const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) return false;
  const domain = trimmed.slice(atIndex + 1);
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
};

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: isValidEmail,
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  message: { type: String, trim: true, maxlength: 500 },
  profilePic: { type: String }, // Base64 image or URL
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

contactSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
