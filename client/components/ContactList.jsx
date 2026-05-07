import React, { useState, useMemo, useDeferredValue } from 'react';
import { deleteContact, getApiErrorMessage } from '../api/contacts';

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      backgroundColor: '#ff453a',
      color: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem'
    }}>
      {message}
    </div>
  );
};

const ContactList = ({ contacts, onContactDeleted, onCreateContact, onContactClick, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      setDeleteError(null);
      await deleteContact(id);
      onContactDeleted();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setDeleteError(getApiErrorMessage(error, 'Unable to delete contact.'));
    }
  };

  const filteredContacts = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedSearch) ||
      contact.phone.includes(normalizedSearch) ||
      contact.email.toLowerCase().includes(normalizedSearch)
    );
  }, [contacts, deferredSearchTerm]);

  const favoriteContacts = useMemo(
    () => filteredContacts.filter(contact => contact.isFavorite),
    [filteredContacts]
  );
  const regularContacts = useMemo(
    () => filteredContacts.filter(contact => !contact.isFavorite),
    [filteredContacts]
  );

  const groupedContacts = useMemo(() => {
    return regularContacts.reduce((groups, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(contact);
      return groups;
    }, {});
  }, [regularContacts]);

  const sortedGroups = useMemo(() => Object.keys(groupedContacts).sort(), [groupedContacts]);

  if (contacts.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#2c2c2e',
        minHeight: '100vh',
        color: 'white',
        padding: '1rem'
      }}>
        {/* Search Bar */}
        <div style={{
          backgroundColor: '#48484a',
          borderRadius: '20px',
          padding: '12px 16px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>←</span>
          <input
            type="text"
            placeholder="Search contacts"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        <ErrorBanner message={error} />
        <ErrorBanner message={deleteError} />

        {/* Create Contact Button */}
        <button
          onClick={onCreateContact}
          style={{
            backgroundColor: '#d4a574',
            color: 'black',
            border: 'none',
            borderRadius: '20px',
            padding: '12px',
            width: '100%',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ marginRight: '8px' }}>👤</span>
          Create contact
        </button>

        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#8e8e93'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No Contacts Yet</h2>
          <p>Tap "Create contact" to add your first contact</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#2c2c2e',
      minHeight: '100vh',
      color: 'white',
      padding: '1rem'
    }}>
      {/* Search Bar */}
      <div style={{
        backgroundColor: '#48484a',
        borderRadius: '20px',
        padding: '12px 16px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>←</span>
        <input
          type="text"
          placeholder="Search contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            width: '100%'
          }}
        />
      </div>

      <ErrorBanner message={error} />
      <ErrorBanner message={deleteError} />

      {/* Create Contact Button */}
      <button
        onClick={onCreateContact}
        style={{
          backgroundColor: '#d4a574',
          color: 'black',
          border: 'none',
          borderRadius: '20px',
          padding: '12px',
          width: '100%',
          fontSize: '1rem',
          fontWeight: '500',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ marginRight: '8px' }}>👤</span>
        Create contact
      </button>

      {/* Contact Count */}
      <div style={{ 
        color: '#8e8e93', 
        fontSize: '0.9rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
      </div>

      {/* Favorites Section */}
      {favoriteContacts.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#8e8e93',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            paddingLeft: '1rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>★</span>
            Favorites
          </div>
          
          {favoriteContacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => onContactClick(contact)}
              style={{
                backgroundColor: '#48484a',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {contact.profilePic ? (
                  <img
                    src={contact.profilePic}
                    alt={contact.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '12px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#007aff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginRight: '12px'
                  }}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '500',
                    marginBottom: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {contact.name}
                    <span style={{ fontSize: '1.2rem' }}>❤️</span>
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#8e8e93'
                  }}>
                    {contact.phone}
                  </div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(contact._id);
                }}
                style={{
                  backgroundColor: '#ff3b30',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grouped Contacts */}
      {sortedGroups.map(letter => (
        <div key={letter} style={{ marginBottom: '1rem' }}>
          <div style={{
            color: '#8e8e93',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            paddingLeft: '1rem'
          }}>
            {letter}
          </div>
          
          {groupedContacts[letter].map((contact) => (
            <div
              key={contact._id}
              onClick={() => onContactClick(contact)}
              style={{
                backgroundColor: '#48484a',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {contact.profilePic ? (
                  <img
                    src={contact.profilePic}
                    alt={contact.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '12px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#007aff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginRight: '12px'
                  }}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {contact.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#8e8e93'
                  }}>
                    {contact.phone}
                  </div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(contact._id);
                }}
                style={{
                  backgroundColor: '#ff3b30',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
