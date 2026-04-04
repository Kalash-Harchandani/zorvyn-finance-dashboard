import React from 'react';
import { IconPlus } from './Icons';

const TransactionForm = ({ formData, setFormData, onSubmit }) => {
  return (
    <div className="card-container">
      <header style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem'}}>
        <IconPlus size={20} color="var(--primary)" />
        <h3 style={{margin: 0}}>Record Transaction</h3>
      </header>
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <div className="input-group">
            <label>Transaction Amount</label>
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
            <label>Operation Type</label>
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
            <label>Business Category</label>
            <input
              type="text"
              placeholder="e.g. Salary, Operations"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Accounting Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Audit Notes (Optional)</label>
          <textarea
            rows="3"
            placeholder="Provide context for this record..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-elite btn-block">ADD TO LEDGER</button>
      </form>
    </div>
  );
};

export default TransactionForm;
