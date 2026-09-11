import React from 'react';
import { Shield, ShieldAlert, User, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(15, 23, 42, 0.85)',
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
          background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
        }}>
          <Shield size={22} color="#040914" />
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
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
          background: 'rgba(0, 242, 254, 0.1)',
          color: 'var(--primary-cyan)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          padding: '0.3rem 0.75rem',
          borderRadius: '20px'
        }}>
          <Shield size={14} />
          <span>Blockchain Audit: <strong>ACTIVE</strong></span>
        </div>
      </div>

      {/* Right Officer Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
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
            padding: '0.5rem',
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
