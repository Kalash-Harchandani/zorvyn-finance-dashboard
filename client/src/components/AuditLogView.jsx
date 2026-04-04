import React from 'react';

const formatDetails = (details) => {
  if (!details) return "System metadata update - No specific notes provided.";
  
  if (typeof details === 'string') {
    try {
      const parsed = JSON.parse(details);
      return formatDetails(parsed);
    } catch {
      return details;
    }
  }
  
  if (typeof details === 'object') {
    if (details.amount !== undefined) {
      return `${details.type === 'income' ? 'Income' : 'Expense'}: $${details.amount} (${details.category}) ${details.notes ? `- ${details.notes}` : ''}`;
    }
    return JSON.stringify(details);
  }
  
  return String(details);
};

const AuditLogView = ({ auditLogs, userRole }) => {

  if (!userRole) {
    return (
      <div className="card-container">
        <div style={{color: '#888', fontStyle: 'italic'}}>Synchronizing security credentials...</div>
      </div>
    );
  }

  if (!['Super Admin', 'Admin', 'Auditor'].includes(userRole)) {
    return (
      <div className="card-container">
        <div className="rbac-denied">
          Insufficient authority to access system audit trails. 
          Clearance Level: <strong>{userRole}</strong>
        </div>
      </div>
    );
  }

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="empty-state">
        <h4>Audit Trail Empty</h4>
        <p>System activities will be logged here as they occur.</p>
      </div>
    );
  }

  return (
    <div className="card-container">
      <header className="section-header">
        <h3>System Transparency Ledger</h3>
        <span className="badge badge-income" style={{fontSize: '0.6rem'}}>Verifiable Records</span>
      </header>

      <div className="audit-list">
        {auditLogs.map((log) => (
          <div key={log.id} style={{padding: '1rem 0', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
            <div style={{minWidth: '80px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: log.action_type === 'DELETE' ? 'var(--error)' : 'var(--text-main)'}}>
              [{log.action_type}]
            </div>
            <div>
              <div style={{fontSize: '0.9rem', marginBottom: '4px'}}>
                Executed by <strong>{log.username}</strong> on table <code>{log.target_table}</code>
              </div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>
                {formatDetails(log.details)}
                {log.action_type === 'DELETE' && <span style={{color: 'var(--error)', marginLeft: '10px'}}>! PERMANENT DELETION</span>}
              </div>
              <div style={{fontSize: '0.7rem', color: '#999', marginTop: '4px'}}>
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogView;
