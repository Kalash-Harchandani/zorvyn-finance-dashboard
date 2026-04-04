import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'welcome', label: '👋 Welcome Guide', icon: '🏠' },
    { id: 'overview', label: '📊 Dashboard Overview', icon: '📈' },
    { id: 'transactions', label: '💸 Transaction List', icon: '📝' },
    { id: 'activity', label: '📑 Activity Logs', icon: '⏳' },
    { id: 'team', label: '👥 Team Management', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header" style={{marginBottom: '2rem'}}>
        <div className="site-logo">Z</div>
        <div className="workspace-branding">
          <h2 style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Zorvyn Finance</h2>
          <small className="text-muted" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: '700'}}>
            {user.organization || 'My Workspace'}
          </small>
        </div>
      </div>

      <div className="user-profile-summary" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dim)'}}>
        <div className="avatar" style={{boxShadow: '0 0 15px var(--primary-glow)'}}>{user.username[0].toUpperCase()}</div>
        <div className="user-info">
          <div className="username" style={{color: 'white'}}>{user.username}</div>
          <span className="role-tag" style={{background: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-dim)'}}>{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => {
          // Hide Team for non-admins if you want, but simple for now
          if (tab.id === 'team' && !['Super Admin', 'Admin'].includes(user.role)) return null;
          if (tab.id === 'activity' && !['Super Admin', 'Admin', 'Auditor'].includes(user.role)) return null;
          
          return (
            <button
              key={tab.id}
              className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="icon">{tab.icon}</span>
              <span className="label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-menu-item" onClick={onLogout}>
        <span className="icon">🚪</span>
        <span className="label">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
