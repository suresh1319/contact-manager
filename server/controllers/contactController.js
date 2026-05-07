const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;
const MAX_QUERY_LIMIT = 200;
const MAX_SEARCH_LENGTH = 50;

const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) return false;
  const domain = trimmed.slice(atIndex + 1);
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
};

const sanitizeContactPayload = (payload, { requireAll }) => {
  const errors = {};
  const data = {};

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  if (requireAll || payload.name !== undefined) {
    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length > MAX_NAME_LENGTH) {
      errors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    } else {
      data.name = name;
    }
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (requireAll || payload.email !== undefined) {
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    } else {
      data.email = email;
    }
  }

  const phone = typeof payload.phone === 'string' ? payload.phone.replace(/\D/g, '') : '';
  if (requireAll || payload.phone !== undefined) {
    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (phone.length !== 10) {
      errors.phone = 'Phone must be 10 digits';
    } else {
      data.phone = phone;
    }
  }

  if (payload.message !== undefined) {
    if (typeof payload.message !== 'string') {
      errors.message = 'Message must be a string';
    } else {
      const message = payload.message.trim();
      if (message.length > MAX_MESSAGE_LENGTH) {
        errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
      } else {
        data.message = message;
      }
    }
  }

  if (payload.profilePic !== undefined) {
    if (typeof payload.profilePic !== 'string') {
      errors.profilePic = 'Profile picture must be a string';
    } else {
      data.profilePic = payload.profilePic;
    }
  }

  if (payload.isFavorite !== undefined) {
    if (typeof payload.isFavorite !== 'boolean') {
      errors.isFavorite = 'Favorite must be true or false';
    } else {
      data.isFavorite = payload.isFavorite;
    }
  }

  return { data, errors };
};

const createContact = async (req, res) => {
  const { data, errors } = sanitizeContactPayload(req.body, { requireAll: true });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  try {
    const contact = await Contact.create(data);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;
    const filter = {};

    if (typeof search === 'string' && search.trim()) {
      const trimmedSearch = search.trim();
      if (trimmedSearch.length > MAX_SEARCH_LENGTH) {
        return res.status(400).json({ error: 'Search term too long' });
      }
      filter.$text = { $search: trimmedSearch };
    }

    const hasSearch = typeof search === 'string' && search.trim();
    let query = Contact.find(filter);
    if (hasSearch) {
      query = query.sort({ score: { $meta: 'textScore' }, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    query = query.lean();
    const parsedLimit = Number.parseInt(limit, 10);
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(Math.min(parsedLimit, MAX_QUERY_LIMIT));
    }

    const parsedOffset = Number.parseInt(offset, 10);
    if (Number.isFinite(parsedOffset) && parsedOffset > 0) {
      query = query.skip(parsedOffset);
    }

    const contacts = await query;
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteContact = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted', id: deleted._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContact = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  const { data, errors } = sanitizeContactPayload(req.body, { requireAll: false });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createContact, getContacts, deleteContact, updateContact };
