import React from 'react';
import { 
  IconDashboard, 
  IconTransactions, 
  IconAudit, 
  IconTeam, 
  IconWelcome, 
  IconLogout 
} from './Icons';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'welcome', label: 'Welcome Guide', Icon: IconWelcome },
    { id: 'overview', label: 'Dashboard', Icon: IconDashboard },
    { id: 'transactions', label: 'Transactions', Icon: IconTransactions },
    { id: 'activity', label: 'Audit Logs', Icon: IconAudit },
    { id: 'team', label: 'Team', Icon: IconTeam },
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
          // RBAC Filtering
          if (tab.id === 'team' && !['Super Admin', 'Admin'].includes(user.role)) return null;
          if (tab.id === 'activity' && !['Super Admin', 'Admin', 'Auditor'].includes(user.role)) return null;
          if (tab.id === 'transactions' && user.role === 'Viewer') return null;
          
          return (
            <button
              key={tab.id}
              className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="icon-box" style={{fontSize: '1.2rem', display: 'flex', alignItems: 'center'}}>
                <tab.Icon size={20} />
              </span>
              <span className="label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-menu-item" onClick={onLogout}>
        <span className="icon-box" style={{fontSize: '1.2rem', display: 'flex', alignItems: 'center'}}>
          <IconLogout size={20} />
        </span>
        <span className="label">Terminate Session</span>
      </button>
    </div>
  );
};

export default Sidebar;
