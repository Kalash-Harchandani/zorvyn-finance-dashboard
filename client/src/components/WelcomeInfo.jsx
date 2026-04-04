const WelcomeInfo = () => {
  const testUsers = [
    { email: 'superadmin@zorvyn.com', role: 'Super Admin', pass: 'password123' },
    { email: 'accountant@zorvyn.com', role: 'Accountant', pass: 'password123' },
    { email: 'auditor@zorvyn.com', role: 'Auditor', pass: 'password123' },
    { email: 'viewer@zorvyn.com', role: 'Viewer', pass: 'password123' },
  ];

  return (
    <div className="welcome-info-vertical">
      <div className="workspace-badge" style={{marginBottom: '2rem'}}>
         🔐 SECURITY FIRST | MULTI-TENANCY ACTIVE
      </div>
      
      <h1 style={{fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem'}}>
        The Next Generation of <span style={{color: 'var(--primary)', textShadow: '0 0 40px var(--primary-glow)'}}>Finance.</span>
      </h1>
      
      <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px'}}>
        Experience absolute data isolation with Zorvyn's enterprise-grade workspace architecture.
      </p>

      <div className="usage-guide" style={{marginBottom: '3rem'}}>
        <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', color: 'white'}}>⚡ QUICK START GUIDE</h4>
        <ul style={{listStyle: 'none', padding: '0', color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
          <li style={{marginBottom: '10px'}}>1. <strong>Simulate</strong>: Login as an Accountant.</li>
          <li style={{marginBottom: '10px'}}>2. <strong>Audit</strong>: Log out and join as an Auditor.</li>
          <li>3. <strong>Scale</strong>: Create your own organization to start fresh.</li>
        </ul>
      </div>

      <div className="credentials-section">
        <h4 style={{fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
           Demo Credentials (Zorvyn HQ)
        </h4>
        <div className="test-profiles-vertical" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {testUsers.map((u) => (
            <div key={u.email} className="test-profile-card">
              <div className="profile-icon" style={{width: '32px', height: '32px', background: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1rem'}}>
                 👤
              </div>
              <div className="profile-details">
                <div className="profile-role">{u.role}</div>
                <div className="profile-email">{u.email} <span style={{color: 'var(--text-muted)'}}>•</span> <code style={{color: 'var(--primary)'}}>{u.pass}</code></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeInfo;
