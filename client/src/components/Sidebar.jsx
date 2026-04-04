import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'welcome', label: 'Welcome Guide', icon: '🏠' },
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💸' },
    { id: 'activity', label: 'Audit Logs', icon: '📑' },
    { id: 'team', label: 'Team', icon: '👥' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="site-logo">Z</div>
        <div className="workspace-branding">
          <h2>Zorvyn Finance</h2>
          <small>{user.organization || 'Internal Workspace'}</small>
        </div>
      </div>

      <div className="user-profile-summary">
        <div className="avatar">{user.username[0].toUpperCase()}</div>
        <div className="user-info">
          <div className="username">{user.username}</div>
          <span className="role-tag">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => {
          if (tab.id === 'team' && !['Super Admin', 'Admin'].includes(user.role)) return null;
          if (tab.id === 'activity' && !['Super Admin', 'Admin', 'Auditor'].includes(user.role)) return null;
          
          return (
            <button
              key={tab.id}
              className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="icon-box" style={{fontSize: '1.2rem'}}>{tab.icon}</span>
              <span className="label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-menu-item" onClick={onLogout}>
        <span className="icon-box" style={{fontSize: '1.2rem'}}>🚪</span>
        <span className="label">Terminate Session</span>
      </button>
    </div>
  );
};

export default Sidebar;
