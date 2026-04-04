import React from 'react';

const WelcomeInfo = () => {
  const testUsers = [
    { email: 'superadmin@zorvyn.com', role: 'Super Admin', access: 'All Access' },
    { email: 'accountant@zorvyn.com', role: 'Accountant', access: 'Create/View' },
    { email: 'auditor@zorvyn.com', role: 'Auditor', access: 'Read/Audit' },
    { email: 'viewer@zorvyn.com', role: 'Viewer', access: 'Insights Only' },
  ];

  return (
    <div className="welcome-info-container">
      <div className="workspace-badge">🏢 Active Workspace: Zorvyn HQ (Public Demo)</div>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Master Your Data Isolation</h1>
      <p style={{fontSize: '1.1rem', color: '#475569', marginBottom: '2rem'}}>
        Experience a production-grade **Multi-Tenant Architecture**. 
        Every workspace is a private silo—what you build here stays here.
      </p>
      
      <div className="test-profiles-grid">
        {testUsers.map((u) => (
          <div key={u.email} className="test-profile-card">
            <div className="profile-role">{u.role}</div>
            <div className="profile-email">{u.email}</div>
            <div className="profile-pass">Password: <code>password123</code></div>
          </div>
        ))}
      </div>

      <div className="usage-guide">
        <h4 style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
           💡 Quick Testing Path
        </h4>
        <ul style={{marginTop: '15px', listStyle: 'none'}}>
          <li style={{marginBottom: '12px'}}>
            <strong>Step 1:</strong> Log in as an <strong>Accountant</strong> and add a new "Office Supply" expense.
          </li>
          <li style={{marginBottom: '12px'}}>
            <strong>Step 2:</strong> Logout and join as an <strong>Auditor</strong> to see that action logged in real-time.
          </li>
          <li>
            <strong>Step 3:</strong> Register your <strong>own Workspace</strong> to see that it starts as a 100% clean slate!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeInfo;
