import React from 'react';
import { 
  IconDashboard, 
  IconTransactions, 
  IconAudit, 
  IconTeam, 
  IconWelcome 
} from '../Icons';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'welcome', label: 'Overview', Icon: IconWelcome },
    { id: 'overview', label: 'Financials', Icon: IconDashboard },
    { id: 'transactions', label: 'Journal', Icon: IconTransactions },
    { id: 'activity', label: 'Audit Trail', Icon: IconAudit },
    { id: 'team', label: 'Administration', Icon: IconTeam },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">Zorvyn</div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => {
          // RBAC Filtering with defensive guards
          if (tab.id === 'team' && !['Super Admin', 'Admin'].includes(user?.role)) return null;
          if (tab.id === 'activity' && !['Super Admin', 'Admin', 'Auditor'].includes(user?.role)) return null;
          if (tab.id === 'transactions' && user?.role === 'Viewer') return null;
          
          return (
            <button
              key={tab.id}
              className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        Terminate session
      </button>
    </div>
  );
};

export default Sidebar;
