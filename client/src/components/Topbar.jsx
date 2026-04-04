import React from 'react';

const Topbar = ({ user }) => {
  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <h2>{user?.organization || 'Enterprise Ledger'}</h2>
      </div>
      <div className="topbar-right">
        <span>Session ID: <strong>{user?.username}</strong></span>
        <span className="role-badge">{user?.role?.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default Topbar;
