import React from 'react';
import AccessDenied from './AccessDenied';
import { IconTrash } from './Icons';

const TransactionTable = ({ records, onDelete, userRole }) => {
  if (records.length > 0 && records[0].id === 'error') {
    return <AccessDenied message={records[0].notes} />;
  }

  if (records.length === 0) {
    return <div className="empty-state">No transactions recorded yet. Use the form to add one!</div>;
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Accounting Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Digital Amount</th>
            {['Super Admin', 'Admin'].includes(userRole) && <th style={{textAlign: 'right'}}>Actions</th>}
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
              <td className="stat-value" style={{fontSize: '1rem', fontWeight: '700'}}>
                ${Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              {['Super Admin', 'Admin'].includes(userRole) && (
                <td style={{textAlign: 'right'}}>
                  <button 
                    onClick={() => onDelete(r.id)} 
                    className="logout-menu-item"
                    style={{padding: '8px', marginTop: '0', display: 'inline-flex', width: 'auto', color: 'var(--error)'}}
                    title="Purge Record"
                  >
                    <IconTrash size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
