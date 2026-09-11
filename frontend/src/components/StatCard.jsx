import React from 'react';

export function StatCard({ title, value, icon: Icon, color = 'cyan', subtitle }) {
  const colorMap = {
    cyan: { bg: 'rgba(0, 242, 254, 0.1)', text: 'var(--primary-cyan)', border: 'rgba(0, 242, 254, 0.25)' },
    emerald: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--success-emerald)', border: 'rgba(16, 185, 129, 0.25)' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning-amber)', border: 'rgba(245, 158, 11, 0.25)' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger-red)', border: 'rgba(239, 68, 68, 0.25)' },
  };

  const current = colorMap[color] || colorMap.cyan;

  return (
    <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: current.bg,
          border: `1px solid ${current.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: current.text
        }}>
          <Icon size={24} />
        </div>
      )}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.1rem' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function RiskBadge({ level }) {
  const norm = (level || 'LOW').toUpperCase();
  if (norm === 'LOW') {
    return <span className="badge badge-low">● Low Risk</span>;
  } else if (norm === 'MEDIUM') {
    return <span className="badge badge-medium">▲ Medium Risk</span>;
  } else {
    return <span className="badge badge-high">✖ High Risk</span>;
  }
}

export function RiskGauge({ score, level }) {
  const normLevel = (level || 'LOW').toUpperCase();
  let gaugeColor = 'var(--success-emerald)';
  if (normLevel === 'MEDIUM') gaugeColor = 'var(--warning-amber)';
  if (normLevel === 'HIGH') gaugeColor = 'var(--danger-red)';

  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
      <div style={{
        position: 'relative',
        width: '160px',
        height: '160px',
        margin: '0 auto',
        borderRadius: '50%',
        background: `conic-gradient(${gaugeColor} 0% ${score}%, rgba(255, 255, 255, 0.08) ${score}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 25px ${gaugeColor}33`
      }}>
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: gaugeColor }}>
            {score}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Risk Score / 100
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <RiskBadge level={normLevel} />
      </div>
    </div>
  );
}
