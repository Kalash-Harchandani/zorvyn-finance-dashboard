const WelcomeInfo = () => {
  const testUsers = [
    { email: 'superadmin@zorvyn.com', role: 'Super Admin', pass: 'password123', scope: 'Full Access: Manage teams, logs, and system global state.' },
    { email: 'accountant@zorvyn.com', role: 'Accountant', pass: 'password123', scope: 'Ledger Write: Can create and update financial data records.' },
    { email: 'auditor@zorvyn.com', role: 'Auditor', pass: 'password123', scope: 'Audit View: Read-only access to all records and transparency logs.' },
    { email: 'viewer@zorvyn.com', role: 'Viewer', pass: 'password123', scope: 'Dashboard: Restricted access to basic summaries and views.' },
  ];

  return (
    <div className="landing-info-vertical">
      <div className="workspace-badge" style={{marginBottom: '2rem'}}>
         🔐 ISOLATED ARCHITECTURE ACTIVE
      </div>
      
      <h1 style={{fontSize: '4rem', fontWeight: '800', lineHeight: '1.0', marginBottom: '2rem'}}>
        Absolute Data <span className="text-primary" style={{textShadow: '0 0 50px var(--primary-glow)'}}>Integrity.</span>
      </h1>
      
      <p style={{fontSize: '1.25rem', color: 'var(--text-dim)', marginBottom: '3rem', maxWidth: '600px', fontWeight: '400'}}>
        Experience the first multi-tenant finance console designed for 100% data silo compliance.
      </p>

      <div className="usage-guide" style={{marginBottom: '3rem'}}>
        <h4 style={{fontSize: '0.8rem', color: 'white', letterSpacing: '0.2em', marginBottom: '1.5rem'}}>SYSTEM OPERATION GUIDELINES</h4>
        <ul style={{listStyle: 'none', padding: '0', color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <li>1. <strong>SIMULATE</strong>: Login as an Accountant to add records.</li>
          <li>2. <strong>AUDIT</strong>: Join as an Auditor to verify logs.</li>
          <li>3. <strong>SCALE</strong>: Register a unique workspace to start fresh.</li>
        </ul>
      </div>

      <div className="credentials-section">
        <h4 style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
           System Clearance Matrix (Zorvyn HQ)
        </h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {testUsers.map((u) => (
            <div key={u.email} className="test-profile-card" style={{padding: '16px'}}>
              <div className="site-logo" style={{width: '32px', height: '32px', fontSize: '0.8rem', background: 'var(--bg-accent)'}}>👤</div>
              <div className="profile-details">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="profile-role" style={{fontSize: '0.85rem', fontWeight: '800'}}>{u.role}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{u.email} <span style={{marginLeft: '4px', color: 'var(--primary)', fontWeight: '600'}}>{u.pass}</span></div>
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', fontStyle: 'italic'}}>{u.scope}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeInfo;
