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
      <h3>🚀 Getting Started with Zorvyn Finance</h3>
      <p>Welcome to your professional finance dashboard. Explore our <strong>Role-Based Access Control (RBAC)</strong> by switching between the following test profiles.</p>
      
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
        <h4>How to Test:</h4>
        <ul>
          <li><strong>Audit Logging:</strong> Perform an action (like adding a record) as an Accountant, then login as an Auditor to see it in the Activity Log.</li>
          <li><strong>Soft Deletion:</strong> Try deleting a record as a Super Admin; it will be marked as deleted in the database without being permanently lost.</li>
          <li><strong>Permission Gates:</strong> Try accessing the Transactions list as a "Viewer" to see our gentle access restriction feedback.</li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeInfo;
