const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) return false;
  const domain = trimmed.slice(atIndex + 1);
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
};

export const MAX_NAME_LENGTH = 100;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_PROFILE_PIC_SIZE_BYTES = 2 * 1024 * 1024;

export const normalizePhone = (value = '') => value.replace(/\D/g, '');

export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export const validateContact = (data, { requireAll = true } = {}) => {
  const errors = {};
  const sanitized = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (requireAll || data.name !== undefined) {
    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length > MAX_NAME_LENGTH) {
      errors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    }
  }
  if (data.name !== undefined) {
    sanitized.name = name;
  }

  const email = typeof data.email === 'string' ? normalizeEmail(data.email) : '';
  if (requireAll || data.email !== undefined) {
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }
  }
  if (data.email !== undefined) {
    sanitized.email = email;
  }

  const phone = typeof data.phone === 'string' ? normalizePhone(data.phone) : '';
  if (requireAll || data.phone !== undefined) {
    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (phone.length !== 10) {
      errors.phone = 'Phone must be 10 digits';
    }
  }
  if (data.phone !== undefined) {
    sanitized.phone = phone;
  }

  if (data.message !== undefined) {
    if (typeof data.message !== 'string') {
      errors.message = 'Message must be a string';
    } else {
      const message = data.message.trim();
      if (message.length > MAX_MESSAGE_LENGTH) {
        errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
      }
      sanitized.message = message;
    }
  }

  if (data.profilePic !== undefined) {
    if (typeof data.profilePic !== 'string') {
      errors.profilePic = 'Profile picture must be a string';
    } else {
      sanitized.profilePic = data.profilePic;
    }
  }

  if (data.isFavorite !== undefined) {
    if (typeof data.isFavorite !== 'boolean') {
      errors.isFavorite = 'Favorite must be true or false';
    } else {
      sanitized.isFavorite = data.isFavorite;
    }
  }

  return { errors, sanitized };
};
