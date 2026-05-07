import React, { useState } from 'react';
import {
  updateContact,
  deleteContact,
  getApiErrorFields,
  getApiErrorMessage
} from '../api/contacts';
import {
  validateContact,
  MAX_PROFILE_PIC_SIZE_BYTES
} from '../utils/contactValidation';

const ContactDetails = ({ contact, onBack, onContactUpdated, onContactDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    message: contact.message || '',
    profilePic: contact.profilePic || '',
    isFavorite: contact.isFavorite || false
  });
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e) => {
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
        setEditData({ ...editData, profilePic: reader.result });
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.profilePic;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const { errors: validationErrors, sanitized } = validateContact(editData, { requireAll: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setSaveStatus(null);
    try {
      await updateContact(contact._id, sanitized);
      setErrors({});
      onContactUpdated();
      setIsEditing(false);
      setSaveStatus({ type: 'success', message: 'Contact updated successfully!' });
    } catch (error) {
      console.error('Error updating contact:', error);
      const fieldErrors = getApiErrorFields(error);
      if (fieldErrors) {
        setErrors(fieldErrors);
      }
      setSaveStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to update contact.')
      });
    }
    setSaving(false);
  };

  const handleEditChange = (field) => (e) => {
    const newValue = e.target.value;
    setEditData((prev) => ({ ...prev, [field]: newValue }));
    setSaveStatus(null);
    const { errors: fieldErrors } = validateContact({ [field]: newValue }, { requireAll: false });
    setErrors((prev) => {
      const updated = { ...prev, [field]: fieldErrors[field] };
      if (!fieldErrors[field]) {
        delete updated[field];
      }
      return updated;
    });
  };

  const toggleFavorite = async () => {
    try {
      const updatedData = { isFavorite: !contact.isFavorite };
      await updateContact(contact._id, updatedData);
      onContactUpdated();
    } catch (error) {
      console.error('Error updating favorite:', error);
      setSaveStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to update favourite.')
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this contact?')) return;
    try {
      setSaveStatus(null);
      await deleteContact(contact._id);
      onContactDeleted();
      onBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setSaveStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to delete contact.')
      });
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setEditData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message || '',
        profilePic: contact.profilePic || '',
        isFavorite: contact.isFavorite || false
      });
      setErrors({});
      setSaveStatus(null);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div style={{
      backgroundColor: '#2c2c2e',
      minHeight: '100vh',
      color: 'white',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #48484a'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#007aff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, flex: 1 }}>Contact Details</h1>
        <button
          onClick={handleToggleEdit}
          style={{
            background: 'none',
            border: 'none',
            color: '#007aff',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {saveStatus && (
        <div style={{
          backgroundColor: saveStatus.type === 'success' ? '#32d74b' : '#ff453a',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {saveStatus.message}
        </div>
      )}

      {/* Profile Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '2rem',
        backgroundColor: '#48484a',
        borderRadius: '12px'
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {editData.profilePic ? (
            <img
              src={editData.profilePic}
              alt={contact.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem'
              }}
            />
          ) : (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#007aff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              margin: '0 auto 1rem auto'
            }}>
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          {isEditing && (
            <label style={{
              position: 'absolute',
              bottom: '1rem',
              right: '0',
              backgroundColor: '#007aff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}>
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
        {errors.profilePic && (
          <div style={{ color: '#ff453a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {errors.profilePic}
          </div>
        )}

        {isEditing ? (
          <div>
            <input
              value={editData.name}
              onChange={handleEditChange('name')}
              style={{
                backgroundColor: '#2c2c2e',
                border: '1px solid #48484a',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%'
              }}
            />
            {errors.name && (
              <div style={{ color: '#ff453a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {errors.name}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{contact.name}</h2>
            <button
              onClick={toggleFavorite}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              {contact.isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          backgroundColor: '#48484a',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ color: '#8e8e93', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Phone</div>
          {isEditing ? (
            <div>
              <input
                value={editData.phone}
                onChange={handleEditChange('phone')}
                style={{
                  backgroundColor: '#2c2c2e',
                  border: '1px solid #48484a',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  width: '100%'
                }}
              />
              {errors.phone && (
                <div style={{ color: '#ff453a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.phone}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '1.1rem' }}>{contact.phone}</div>
          )}
        </div>

        <div style={{
          backgroundColor: '#48484a',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ color: '#8e8e93', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email</div>
          {isEditing ? (
            <div>
              <input
                value={editData.email}
                onChange={handleEditChange('email')}
                style={{
                  backgroundColor: '#2c2c2e',
                  border: '1px solid #48484a',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  width: '100%'
                }}
              />
              {errors.email && (
                <div style={{ color: '#ff453a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.email}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '1.1rem' }}>{contact.email}</div>
          )}
        </div>

        {(contact.message || isEditing) && (
          <div style={{
            backgroundColor: '#48484a',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ color: '#8e8e93', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Message</div>
            {isEditing ? (
              <div>
                <textarea
                  value={editData.message}
                  onChange={handleEditChange('message')}
                  rows="3"
                  style={{
                    backgroundColor: '#2c2c2e',
                    border: '1px solid #48484a',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    width: '100%',
                    resize: 'vertical'
                  }}
                />
                {errors.message && (
                  <div style={{ color: '#ff453a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {errors.message}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '1rem', fontStyle: 'italic' }}>{contact.message}</div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing ? (
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: '#007aff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer',
            marginBottom: '1rem'
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      ) : (
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: '#ff3b30',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Delete Contact
        </button>
      )}

      <div style={{
        color: '#8e8e93',
        fontSize: '0.85rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        Added: {new Date(contact.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ContactDetails;
