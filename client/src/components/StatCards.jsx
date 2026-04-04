import React from 'react';
import { IconTrendingUp, IconTrendingDown, IconShield } from './Icons';

const StatCards = ({ summary }) => {
  if (!summary || summary.error) {
    return (
      <div className="stats-grid error-state">
        <div className="stat-card" style={{borderColor: 'var(--error)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
          <IconShield size={24} color="var(--error)" />
          <h4>Overview Unavailable</h4>
          <p>{summary?.error || "Unable to load financial summary."}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: summary.total_income, type: 'income', Icon: IconTrendingUp },
    { label: 'Total Outflow', value: summary.total_expense, type: 'expense', Icon: IconTrendingDown },
    { label: 'Net Liquidity', value: summary.net_balance, type: 'net', Icon: IconShield },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className={`stat-card ${s.type}`}>
          <div className="stat-header">
            <span className="icon-box" style={{display: 'flex', alignItems: 'center'}}>
              <s.Icon size={18} />
            </span>
            <span>{s.label}</span>
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
