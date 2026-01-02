import React, { useState } from 'react';
import axios from 'axios';

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditData({ ...editData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${contact._id}`, editData);
      onContactUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const updatedData = { ...contact, isFavorite: !contact.isFavorite };
      await axios.put(`http://localhost:5000/api/contacts/${contact._id}`, updatedData);
      onContactUpdated();
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this contact?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${contact._id}`);
      onContactDeleted();
      onBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
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
          onClick={() => setIsEditing(!isEditing)}
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

        {isEditing ? (
          <input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
            <input
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
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
            <input
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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
              <textarea
                value={editData.message}
                onChange={(e) => setEditData({ ...editData, message: e.target.value })}
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
          style={{
            backgroundColor: '#007aff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Save Changes
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