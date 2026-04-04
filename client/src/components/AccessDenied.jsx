import React from 'react';
import { IconLock } from './Icons';

const AccessDenied = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{color: 'var(--error)'}}>
        <IconLock size={48} />
      </div>
      <h4>Access Permission Denied</h4>
      <p>{message || "You do not have the required clearance level to access this organizational asset."}</p>
      <div className="access-denied-hint">Contact a Super Admin if you believe this is an error.</div>
    </div>
  );
};

export default AccessDenied;
