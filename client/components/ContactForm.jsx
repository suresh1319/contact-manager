import React, { useState } from 'react';
import Input from './Input';
import {
  createContact,
  updateContact,
  deleteContact,
  getApiErrorFields,
  getApiErrorMessage
} from '../api/contacts';
import {
  validateContact,
  MAX_PROFILE_PIC_SIZE_BYTES
} from '../utils/contactValidation';

const ContactForm = ({ onContactAdded, contact, onContactDeleted }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '', 
    email: contact?.email || '', 
    phone: contact?.phone || '', 
    message: contact?.message || '', 
    profilePic: contact?.profilePic || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const getFieldError = (field, value) => {
    const { errors: fieldErrors } = validateContact({ [field]: value }, { requireAll: false });
    return fieldErrors[field];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: validationErrors, sanitized } = validateContact(formData, { requireAll: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setSubmitStatus(null);
    try {
      if (contact) {
        await updateContact(contact._id, sanitized);
      } else {
        await createContact(sanitized);
      }
      setFormData({ name: '', email: '', phone: '', message: '', profilePic: '' });
      setErrors({});
      onContactAdded();
      setSubmitStatus({
        type: 'success',
        message: contact ? 'Contact updated successfully!' : 'Contact added successfully!'
      });
    } catch (error) {
      console.error('Error:', error);
      const fieldErrors = getApiErrorFields(error);
      if (fieldErrors) {
        setErrors(fieldErrors);
      }
      setSubmitStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to save contact.')
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this contact?')) return;
    try {
      setSubmitStatus(null);
      await deleteContact(contact._id);
      onContactDeleted();
      setSubmitStatus({ type: 'success', message: 'Contact deleted successfully!' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      setSubmitStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to delete contact.')
      });
    }
  };

  const handleChange = (field) => (e) => {
    const newValue = e.target.value;
    const newFormData = { ...formData, [field]: newValue };
    setFormData(newFormData);
    setSubmitStatus(null);
    
    const fieldError = getFieldError(field, newValue);
    setErrors((prev) => {
      const updated = { ...prev, [field]: fieldError };
      if (!fieldError) {
        delete updated[field];
      }
      return updated;
    });
  };

  const isValid = formData.name && formData.email && formData.phone && Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem', color: 'white' }}>
        {contact ? 'Edit Contact' : 'Add New Contact'}
      </h2>

      {submitStatus && (
        <div style={{
          backgroundColor: submitStatus.type === 'success' ? '#32d74b' : '#ff453a',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {submitStatus.message}
        </div>
      )}
      
      <Input
        label="Name"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
      />
      
      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
        required
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > MAX_PROFILE_PIC_SIZE_BYTES) {
                setErrors((prev) => ({
                  ...prev,
                  profilePic: 'Profile picture must be 2MB or smaller'
                }));
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setFormData({ ...formData, profilePic: reader.result });
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.profilePic;
                  return updated;
                });
              };
              reader.readAsDataURL(file);
            }
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #48484a',
            borderRadius: '8px',
            fontSize: '1rem',
            backgroundColor: '#48484a',
            color: 'white',
            outline: 'none'
          }}
        />
        {errors.profilePic && (
          <span style={{ color: '#ff3b30', fontSize: '0.875rem' }}>{errors.profilePic}</span>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>Message</label>
        <textarea
          value={formData.message}
          onChange={handleChange('message')}
          rows="4"
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            border: '1px solid #48484a', 
            borderRadius: '8px', 
            fontSize: '1rem',
            backgroundColor: '#48484a',
            color: 'white',
            outline: 'none'
          }}
        />
        {errors.message && (
          <span style={{ color: '#ff3b30', fontSize: '0.875rem' }}>{errors.message}</span>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!isValid || loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: isValid && !loading ? '#007aff' : '#48484a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: isValid && !loading ? 'pointer' : 'not-allowed',
          marginBottom: '1rem'
        }}
      >
        {loading ? 'Saving...' : (contact ? 'Update Contact' : 'Submit Contact')}
      </button>
      
      <button
        type="button"
        onClick={contact ? handleDelete : () => {
          setFormData({ name: '', email: '', phone: '', message: '', profilePic: '' });
          setErrors({});
        }}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#ff3b30',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        {contact ? 'Delete Contact' : 'Clear Form'}
      </button>
    </form>
  );
};

export default ContactForm;
