import React from 'react';
import { IconAudit, IconPlus, IconTrash } from './Icons';
import AccessDenied from './AccessDenied';

const AuditLogView = ({ auditLogs }) => {
  if (auditLogs.length > 0 && auditLogs[0].id === 'error') {
    return <AccessDenied message="Only Auditors and Admins can view the system's full activity history." />;
  }

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <IconAudit size={48} />
        </div>
        <h4>Audit Vault Empty</h4>
        <p>System transparency logs will appear here as transactions are realized.</p>
      </div>
    );
  }

  return (
    <div className="audit-container">
      <header style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
        <IconAudit size={24} color="var(--primary)" />
        <h3 style={{margin: 0}}>System Activity History</h3>
      </header>
      <div className="audit-list">
        {auditLogs.map((log) => (
          <div key={log.id} className="audit-item" style={{display: 'flex', gap: '15px', padding: '12px 0', borderBottom: '1px solid var(--border-dim)'}}>
            <div className="action-marker" style={{paddingTop: '4px'}}>
              {log.action_type === 'CREATE' ? (
                <IconPlus size={16} color="var(--success)" />
              ) : log.action_type === 'DELETE' ? (
                <IconTrash size={16} color="var(--error)" />
              ) : (
                <div style={{width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6}} />
              )}
            </div>
            <div className="audit-details">
              <div style={{fontSize: '0.9rem', marginBottom: '2px'}}>
                <strong>{log.action_type}</strong> by <span>{log.username}</span>
              </div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>
                Performed on <code>{log.target_table}</code>
                {log.action_type === 'DELETE' && <span className="warning-text"> (Record Soft-Deleted)</span>}
              </div>
              <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px'}}>
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
