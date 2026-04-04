import React from 'react';

const TransactionForm = ({ formData, setFormData, onSubmit, userRole }) => {
  const isDisabled = ['Viewer', 'Auditor'].includes(userRole);

  return (
    <div className="card-container">
      <header className="section-header">
        <h3>Record Entry</h3>
        {isDisabled && <span className="badge badge-expense">READ-ONLY ACCESS</span>}
      </header>

      {isDisabled && (
        <div className="rbac-denied" style={{marginBottom: '1.5rem'}}>
          Authority Level: <strong>{userRole}</strong>. Your account does not have write-clearance for the financial journal.
        </div>
      )}

      <form onSubmit={onSubmit} className="minimal-form">
        <label>Accounting Date</label>
        <input 
          type="date" 
          value={formData.date} 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          disabled={isDisabled}
          required 
        />

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          <div>
            <label>Category</label>
            <input 
              type="text" 
              placeholder="e.g. Payroll" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              disabled={isDisabled}
              required 
            />
          </div>
          <div>
            <label>Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
              disabled={isDisabled}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <label>Amount (USD)</label>
        <input 
          type="number" 
          step="0.01"
          placeholder="0.00" 
          value={formData.amount} 
          onChange={e => setFormData({...formData, amount: e.target.value})} 
          disabled={isDisabled}
          required 
        />

        <label>Operational Notes</label>
        <textarea 
          placeholder="Optional metadata..." 
          value={formData.notes} 
          onChange={e => setFormData({...formData, notes: e.target.value})}
          disabled={isDisabled}
        />

        <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={isDisabled}>
          {isDisabled ? 'Submission Locked' : 'Execute Record'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
