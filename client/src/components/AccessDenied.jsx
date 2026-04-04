import React from 'react';

const AccessDenied = ({ message }) => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-icon">🔒</div>
      <h4>Access Restricted</h4>
      <p>{message || "Your current role does not have the required permissions to view this section."}</p>
      <div className="access-denied-hint">Contact a Super Admin if you believe this is an error.</div>
    </div>
  );
};

export default AccessDenied;
