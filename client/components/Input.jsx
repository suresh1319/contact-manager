import React from 'react';

const Input = ({ label, type = 'text', value, onChange, error, required }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
      {label} {required && <span style={{ color: '#ff3b30' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: error ? '2px solid #ff3b30' : '1px solid #48484a',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: '#48484a',
        color: 'white',
        outline: 'none'
      }}
    />
    {error && <span style={{ color: '#ff3b30', fontSize: '0.875rem' }}>{error}</span>}
  </div>
);

export default Input;