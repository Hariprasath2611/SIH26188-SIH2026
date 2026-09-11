import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, History, Database, UserCheck, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/new-screening', label: 'New Screening', icon: FilePlus },
    { path: '/history', label: 'Screening History', icon: History },
    { path: '/blockchain-audit', label: 'Blockchain Audit', icon: Database },
    { path: '/profile', label: 'Officer Profile', icon: UserCheck },
  ];

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0 0.75rem 0.75rem 0.75rem'
        }}>
          Navigation Menu
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                background: isActive ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary-cyan)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        background: 'rgba(0, 242, 254, 0.04)',
        border: '1px solid rgba(0, 242, 254, 0.15)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
          SIH 2026 PROTOTYPE
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
          Synthetic Data Enabled
        </div>
      </div>
    </aside>
  );
}
