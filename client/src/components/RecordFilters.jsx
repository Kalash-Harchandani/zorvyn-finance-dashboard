import React from 'react';

const RecordFilters = ({ filters, onFilterChange, onApply, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="card-container filter-container">
      <div className="filter-grid">
        <div className="filter-group">
          <label>Type</label>
          <select 
            className="filter-input"
            name="type" 
            value={filters.type} 
            onChange={handleChange}
          >
            <option value="">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <input 
            className="filter-input"
            type="text" 
            name="category" 
            value={filters.category} 
            onChange={handleChange}
            placeholder="e.g. Payroll"
          />
        </div>

        <div className="filter-group">
          <label>Notes Search</label>
          <input 
            className="filter-input"
            type="text" 
            name="search" 
            value={filters.search} 
            onChange={handleChange}
            placeholder="Search notes..."
          />
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input 
            className="filter-input"
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input 
            className="filter-input"
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange}
          />
        </div>

        <div className="filter-actions">
          <button 
            onClick={onApply} 
            className="btn-primary" 
            style={{ flex: 2, padding: '10px', fontSize: '0.8rem', fontWeight: '700' }}
          >
            Apply
          </button>
          <button 
            onClick={onReset} 
            className="menu-item" 
            style={{ flex: 1, padding: '10px', fontSize: '0.8rem', border: '1px solid var(--border-light)', textAlign: 'center' }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordFilters;
