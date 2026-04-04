import React from 'react';

const StatCards = ({ summary }) => {
  if (!summary || summary.error) {
    return (
      <div className="stats-grid">
         <div className="stat-card" style={{borderColor: 'var(--error)'}}>
          <div className="stat-label">System Error</div>
          <div className="stat-value" style={{color: 'var(--error)', fontSize: '1rem'}}>{summary?.error || "Synchronization Failed"}</div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Inflow', value: summary.total_income },
    { label: 'Total Outflow', value: summary.total_expense },
    { label: 'Net Liquidity', value: summary.net_balance },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">
            ${Number(s.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{marginTop: '1rem', fontSize: '0.65rem', color: '#999', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
            Verified Ledger Record
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
