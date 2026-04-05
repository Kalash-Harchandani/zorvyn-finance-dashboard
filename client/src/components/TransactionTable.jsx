import React from 'react';
import AccessDenied from './AccessDenied';
import { IconEdit, IconTrash } from '../Icons';

const TransactionTable = ({ records, onDelete, onEdit, userRole }) => {
  const isAuthorized = ['Super Admin', 'Admin', 'Accountant'].includes(userRole);
  const canDelete = ['Super Admin', 'Admin'].includes(userRole);

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
              <td style={{textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center'}}>
                <button 
                  onClick={() => onEdit(r)} 
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px', 
                    margin: '0', 
                    fontSize: '0.75rem',
                    opacity: isAuthorized ? 1 : 0.3,
                    cursor: isAuthorized ? 'pointer' : 'not-allowed',
                    background: '#e0e7ff',
                    color: '#000000',
                    border: '1px solid #c7d2fe'
                  }}
                  disabled={!isAuthorized}
                  title={isAuthorized ? "Amend Record" : "Authority Level Required"}
                >
                  <IconEdit size={14} color="#000000" />
                  {isAuthorized ? 'Edit' : 'Locked'}
                </button>
                <button 
                  onClick={() => onDelete(r.id)} 
                  className="logout-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px', 
                    margin: '0', 
                    fontSize: '0.75rem',
                    opacity: canDelete ? 1 : 0.3,
                    cursor: canDelete ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!canDelete}
                  title={canDelete ? "Purge Record" : "Authority Level Required"}
                >
                  {canDelete ? <><IconTrash size={14} color="var(--error)" /> Delete</> : 'Locked'}
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
