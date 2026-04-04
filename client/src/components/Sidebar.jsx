import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'welcome', label: '👋 Welcome Guide', icon: '🏠' },
    { id: 'overview', label: '📊 Dashboard Overview', icon: '📈' },
    { id: 'transactions', label: '💸 Transaction List', icon: '📝' },
    { id: 'activity', label: '📑 Activity Logs', icon: '⏳' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="site-logo">Z</div>
        <h2>Zorvyn Finance</h2>
      </div>

      <div className="user-profile-summary">
        <div className="avatar">{user.username[0].toUpperCase()}</div>
        <div className="user-info">
          <div className="username">{user.username}</div>
          <span className="role-tag">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-menu-item" onClick={onLogout}>
        <span className="icon">🚪</span>
        <span className="label">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
