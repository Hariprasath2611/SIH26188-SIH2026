import React from 'react';
import { Shield, LogOut, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(2, 132, 199, 0.3)'
        }}>
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            IDShield <span style={{ color: 'var(--primary-cyan)' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            MHA • Security Screening System (SIH 26188)
          </div>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          background: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--success-emerald)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.3rem 0.75rem',
          borderRadius: '20px'
        }}>
          <CheckCircle2 size={14} />
          <span>AI Engine: <strong>LIVE MODE</strong></span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          background: 'rgba(2, 132, 199, 0.1)',
          color: 'var(--primary-cyan)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          padding: '0.3rem 0.75rem',
          borderRadius: '20px'
        }}>
          <Shield size={14} />
          <span>Blockchain Audit: <strong>ACTIVE</strong></span>
        </div>
      </div>

      {/* Right Officer Profile & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--primary-cyan)',
            padding: '0.55rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {user?.name || "Inspector Rajesh Kumar"}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {user?.officer_id || "OFFICER-7892"} • {user?.role || "Senior Officer"}
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          title="Logout"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: 'var(--danger-red)',
            padding: '0.55rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
