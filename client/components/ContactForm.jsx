import React, { useState } from 'react';
import axios from 'axios';
import Input from './Input';

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (contact) {
        await axios.put(`http://localhost:5000/api/contacts/${contact._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/contacts', formData);
      }
      setFormData({ name: '', email: '', phone: '', message: '', profilePic: '' });
      setErrors({});
      onContactAdded();
      alert(contact ? 'Contact updated successfully!' : 'Contact added successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this contact?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${contact._id}`);
      onContactDeleted();
      alert('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const isValid = formData.name && formData.email && formData.phone && Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem', color: 'white' }}>
        {contact ? 'Edit Contact' : 'Add New Contact'}
      </h2>
      
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
              const reader = new FileReader();
              reader.onload = () => setFormData({ ...formData, profilePic: reader.result });
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