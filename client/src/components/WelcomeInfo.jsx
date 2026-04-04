const WelcomeInfo = () => {
  const accessTiers = [
    { 
      role: 'Admin', 
      icon: '🛡️', 
      class: 'admin', 
      scope: [
        'Create and manage teams',
        'Full access to all financial data',
        'Add and delete financial records'
      ], 
      email: 'superadmin@zorvyn.com' 
    },
    { 
      role: 'Accountant', 
      icon: '📊', 
      class: 'accountant', 
      scope: [
        'Add financial records',
        'Cannot delete existing entries'
      ], 
      email: 'accountant@zorvyn.com' 
    },
    { 
      role: 'Auditor', 
      icon: '⚖️', 
      class: 'auditor', 
      scope: [
        'Read-only access to all financial data',
        'Cannot create, update, or delete records'
      ], 
      email: 'auditor@zorvyn.com' 
    },
    { 
      role: 'Viewer', 
      icon: '👁️', 
      class: 'viewer', 
      scope: [
        'View income and expense summaries',
        'No access to transaction history'
      ], 
      email: 'viewer@zorvyn.com' 
    },
  ];

  return (
    <div className="landing-info-vertical">
      <div className="workspace-badge" style={{marginBottom: '2rem'}}>
         🔐 ISOLATED ARCHITECTURE ACTIVE
      </div>
      
      <h1 style={{fontSize: '4.8rem', fontWeight: '800', lineHeight: '0.85', marginBottom: '2.5rem', letterSpacing: '-0.04em'}}>
        Absolute Data <br/><span className="text-primary" style={{textShadow: '0 0 50px var(--primary-glow)'}}>Integrity.</span>
      </h1>
      
      <p style={{fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '3.5rem', maxWidth: '580px', fontWeight: '400', lineHeight: '1.6'}}>
        A high-fidelity multi-tenant console engineered for absolute data silo compliance and role-based operational precision.
      </p>

      <div className="credentials-section">
        <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--primary)', fontWeight: '800', marginBottom: '1.5rem'}}>
           SYSTEM ACCESS HIERARCHY
        </h4>
        
        <div className="access-grid">
          {accessTiers.map((tier) => (
            <div key={tier.role} className={`access-tile ${tier.class}`}>
              <div className="tile-header">
                <div className="tile-icon">{tier.icon}</div>
                <div style={{fontSize: '1.1rem'}}>{tier.role}</div>
              </div>
              <ul style={{listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {tier.scope.map((item, i) => (
                  <li key={i} style={{fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4'}}>
                    • {item}
                  </li>
                ))}
              </ul>
              <div className="tile-creds">
                {tier.email} <span style={{color: 'var(--primary)', fontWeight: '700', marginLeft: '6px'}}>password123</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeInfo;
