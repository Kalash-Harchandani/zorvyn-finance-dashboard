import React from 'react';

const WelcomeInfo = () => {
  const testUsers = [
    { email: 'superadmin@zorvyn.com', role: 'Super Admin', access: 'All Access' },
    { email: 'accountant@zorvyn.com', role: 'Accountant', access: 'Create/View' },
    { email: 'auditor@zorvyn.com', role: 'Auditor', access: 'Read/Audit' },
    { email: 'viewer@zorvyn.com', role: 'Viewer', access: 'Dashboard Only' },
  ];

  return (
    <div className="welcome-info-container">
      <div className="workspace-badge">🏢 Workspace: Zorvyn Headquarters (Global Demo)</div>
      <h3>🚀 Getting Started with Multi-Tenant Workspaces</h3>
      <p>Welcome to your professional finance dashboard. Explore our **Role-Based Access Control (RBAC)** across isolated organizations. You can either test with our pre-seeded team below or create your own private workspace.</p>
      
      <div className="test-profiles-grid">
        {testUsers.map((u) => (
          <div key={u.email} className="test-profile-card">
            <div className="profile-role">{u.role}</div>
            <div className="profile-email">{u.email}</div>
            <div className="profile-access">{u.access}</div>
            <div className="profile-pass">Password: <code>password123</code></div>
          </div>
        ))}
      </div>

      <div className="usage-guide">
        <h4>Key Isolated Features:</h4>
        <ul>
          <li><strong>Organization Walls:</strong> Register a new workspace to see 100% data isolation. Records created in Acme Corp can **never** be seen by Zorvyn HQ.</li>
          <li><strong>Team Management:</strong> Log in as an Admin to invite your own Accountants and Auditors. They will be automatically linked to your organization.</li>
          <li><strong>Audit Logging:</strong> System monitoring is scoped to your organization only. Auditors only see activity from their specific team members.</li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeInfo;
