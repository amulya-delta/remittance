import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Notification</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default Notification;
