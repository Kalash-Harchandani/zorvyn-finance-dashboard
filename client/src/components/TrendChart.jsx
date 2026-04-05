import React from 'react';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="empty-state">No trend data available for this period.</div>
  );

  const padding = { top: 30, right: 40, bottom: 40, left: 60 };
  const height = 240;
  const width = 800; // Increased width for better horizontal feel
  
  // Find max value across both metrics for scaling
  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense, 500))) * 1.25;
  const stepX = (width - padding.left - padding.right) / (data.length - 1);
  
  const getY = (val) => height - padding.bottom - (val / maxVal) * (height - padding.top - padding.bottom);
  const getX = (index) => padding.left + index * stepX;

  // Generate line paths
  const incomePoints = data.map((d, i) => `${getX(i)},${getY(d.income)}`).join(' ');
  const expensePoints = data.map((d, i) => `${getX(i)},${getY(d.expense)}`).join(' ');

  // Generate Area paths (for gradients)
  const incomeArea = `${incomePoints} ${getX(data.length - 1)},${height - padding.bottom} ${getX(0)},${height - padding.bottom} Z`;
  const expenseArea = `${expensePoints} ${getX(data.length - 1)},${height - padding.bottom} ${getX(0)},${height - padding.bottom} Z`;

  return (
    <div className="chart-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-Axis Grid lines & Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = getY(maxVal * p);
          return (
            <g key={i}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="var(--border-light)" 
                strokeWidth="1"
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 15} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="10" 
                fontWeight="500"
                fill="var(--text-muted)"
              >
                ${(maxVal * p).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </text>
            </g>
          );
        })}

        {/* X-Axis Labels (Days) */}
        {data.map((d, i) => (
          <text 
            key={i} 
            x={getX(i)} 
            y={height - 10} 
            textAnchor="middle" 
            fontSize="11" 
            fontWeight="600" 
            fill="var(--text-dim)"
          >
            {d.dayName}
          </text>
        ))}

        {/* Area Fills */}
        <path d={incomeArea} fill="url(#incomeGradient)" />
        <path d={expenseArea} fill="url(#expenseGradient)" />

        {/* Income Line */}
        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={incomePoints}
          style={{ transition: 'all 0.5s ease-in-out' }}
        />
        {data.map((d, i) => (
          <circle key={`i-${i}`} cx={getX(i)} cy={getY(d.income)} r="3.5" fill="var(--bg-white)" stroke="#4f46e5" strokeWidth="2" />
        ))}

        {/* Expense Line */}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={expensePoints}
          style={{ transition: 'all 0.5s ease-in-out' }}
        />
        {data.map((d, i) => (
          <circle key={`e-${i}`} cx={getX(i)} cy={getY(d.expense)} r="3.5" fill="var(--bg-white)" stroke="#ef4444" strokeWidth="2" />
        ))}
      </svg>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#4f46e5', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>Inflow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>Outflow</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
