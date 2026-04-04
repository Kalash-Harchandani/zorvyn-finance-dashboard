import React from 'react';
import AccessDenied from './AccessDenied';

const TransactionTable = ({ records, onDelete, userRole }) => {
  const isAuthorized = ['Super Admin', 'Admin'].includes(userRole);

  if (records.length > 0 && records[0].id === 'error') {
    return <AccessDenied message={records[0].notes} />;
  }

  if (records.length === 0) {
    return <div className="empty-state">No journal entries found in the ledger.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="enterprise-table">
        <thead>
          <tr>
            <th>Accounting Date</th>
            <th>Business Category</th>
            <th>Operational Type</th>
            <th>Amount (USD)</th>
            <th style={{textAlign: 'right'}}>Journal Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td style={{fontWeight: '600'}}>{r.category}</td>
              <td>
                <span className={`badge badge-${r.type}`}>
                  {r.type.toUpperCase()}
                </span>
              </td>
              <td style={{fontWeight: '700'}}>
                ${Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td style={{textAlign: 'right'}}>
                <button 
                  onClick={() => onDelete(r.id)} 
                  className="logout-btn"
                  style={{
                    padding: '4px 12px', 
                    margin: '0', 
                    fontSize: '0.75rem',
                    opacity: isAuthorized ? 1 : 0.3,
                    cursor: isAuthorized ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!isAuthorized}
                  title={isAuthorized ? "Purge Record" : "Authority Level Required"}
                >
                  {isAuthorized ? 'Delete' : 'Locked'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
