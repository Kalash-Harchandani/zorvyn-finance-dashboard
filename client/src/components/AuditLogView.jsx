import React from 'react';
import AccessDenied from './AccessDenied';

const AuditLogView = ({ auditLogs }) => {
  if (auditLogs.length > 0 && auditLogs[0].id === 'error') {
    return <AccessDenied message="Only Auditors and Admins can view the system's full activity history." />;
  }

  if (auditLogs.length === 0) {
    return <div className="empty-state">No recent activity found.</div>;
  }

  return (
    <div className="audit-log-container">
      <h3>📜 System Activity History</h3>
      <div className="audit-timeline">
        {auditLogs.map((log) => (
          <div key={log.id} className="timeline-item">
            <div className="timeline-badge action-icon">
              {log.action_type === 'CREATE' ? '➕' : log.action_type === 'DELETE' ? '🗑️' : '✏️'}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <strong>{log.username}</strong>
                <span className="timestamp text-muted">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="timeline-body">
                Performed <strong>{log.action_type}</strong> on <code>{log.target_table}</code>
                {log.action_type === 'DELETE' && <span className="warning-text"> (Record Soft-Deleted)</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogView;
