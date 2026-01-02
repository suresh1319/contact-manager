import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';
import ContactDetails from '../components/ContactDetails';
import Modal from '../components/Modal';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
    setLoading(false);
  };

  const handleContactAdded = () => {
    fetchContacts();
    setShowModal(false);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleBackToList = () => {
    setSelectedContact(null);
  };

  const handleContactUpdated = () => {
    fetchContacts();
    setSelectedContact(null);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#2c2c2e',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
          <h2>Loading contacts...</h2>
        </div>
      </div>
    );
  }

  if (selectedContact) {
    return (
      <ContactDetails
        contact={selectedContact}
        onBack={handleBackToList}
        onContactUpdated={handleContactUpdated}
        onContactDeleted={fetchContacts}
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#2c2c2e'
    }}>
      <ContactList 
        contacts={contacts} 
        onContactDeleted={fetchContacts}
        onCreateContact={() => setShowModal(true)}
        onContactClick={handleContactClick}
      />

      {/* Modal for Contact Form */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ContactForm onContactAdded={handleContactAdded} />
      </Modal>
    </div>
  );
};

export default App;