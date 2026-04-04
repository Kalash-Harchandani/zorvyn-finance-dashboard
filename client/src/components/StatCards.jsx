import React from 'react';

const StatCards = ({ summary }) => {
  if (!summary || summary.error) {
    return (
      <div className="stats-grid error-state">
        <div className="stat-card error">
          <span className="icon">⚠️</span>
          <h4>Overview Unavailable</h4>
          <p>{summary?.error || "Unable to load financial summary."}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Income', value: summary.total_income, type: 'income', icon: '💰' },
    { label: 'Total Expense', value: summary.total_expense, type: 'expense', icon: '💸' },
    { label: 'Net Balance', value: summary.net_balance, type: 'net', icon: '⚖️' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className={`stat-card ${s.type}`}>
          <div className="stat-header">
            <span className="icon">{s.icon}</span>
            <span className="label text-muted">{s.label}</span>
          </div>
          <div className="stat-value">
            ${Number(s.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
