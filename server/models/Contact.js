const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/i, 'Invalid email format']
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

contactSchema.index({ name: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

module.exports = mongoose.model('Contact', contactSchema);
