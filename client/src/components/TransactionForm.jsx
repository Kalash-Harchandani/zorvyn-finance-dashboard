import React from 'react';

const TransactionForm = ({ formData, setFormData, onSubmit }) => {
  return (
    <div className="card-container form-card">
      <h3>➕ New Transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <div className="input-group">
            <label>Amount</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="input-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="e.g. Salary, Food"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            placeholder="Add details..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">Add Record</button>
      </form>
    </div>
  );
};

export default TransactionForm;
