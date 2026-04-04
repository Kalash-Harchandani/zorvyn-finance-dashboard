import React from 'react';

const AccessDenied = ({ message }) => {
  return (
    <div className="card-container" style={{borderColor: 'var(--error)'}}>
      <div className="rbac-denied" style={{textAlign: 'center', padding: '3rem'}}>
        <h1 style={{fontSize: '0.75rem', letterSpacing: '0.5em', marginBottom: '2rem', color: 'var(--error)'}}>
          AUTHORITY_REQUIRED
        </h1>
        <p style={{fontSize: '0.9rem', color: 'var(--text-main)', maxWidth: '400px', margin: '0 auto'}}>
          {message || "Your current security token lacks the necessary clearance level to view this module."}
        </p>
        <div style={{marginTop: '2rem', fontSize: '0.7rem', color: '#999'}}>
          ERR_CODE: 403_FORBIDDEN_RESOURCE
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
