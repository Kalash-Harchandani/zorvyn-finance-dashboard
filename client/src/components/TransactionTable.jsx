import React from 'react';
import AccessDenied from './AccessDenied';

const TransactionTable = ({ records, onDelete }) => {
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
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.category}</td>
              <td className={`type-cell ${r.type}`}>
                {r.type.toUpperCase()}
              </td>
              <td className="amount-cell">
                ${Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td>
                <button 
                  onClick={() => onDelete(r.id)} 
                  className="btn btn-delete btn-sm"
                  title="Delete Transaction"
                >
                  🗑️
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
