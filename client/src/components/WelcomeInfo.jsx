import React from 'react';

const WelcomeInfo = ({ user }) => {
  return (
    <div className="card-container">
      <header className="section-header">
        <h3>Operational Onboarding</h3>
        <span className="badge badge-income">Security Clearance: {user?.role}</span>
      </header>

      <section style={{marginBottom: '3rem'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Welcome to Zorvyn.</h1>
        <p style={{color: 'var(--text-dim)', maxWidth: '800px', fontSize: '1.1rem'}}>
          You are currently authenticated within the <strong>{user?.organization}</strong> tenant. 
          This dashboard provides a consolidated view of organizational fiscal health and audit transparency. 
          Please review your role-based permissions below.
        </p>
      </section>

      <footer style={{marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#888'}}>
        <div>PROTOCOL: <strong>ZORVYN-SEC-256</strong></div>
        <div>TENANT_ID: <strong>{user?.tenant_id || 'LOCAL-01'}</strong></div>
        <div>USER_ID: <strong>#{user?.id}</strong></div>
      </footer>
    </div>
  );
};

export default WelcomeInfo;
