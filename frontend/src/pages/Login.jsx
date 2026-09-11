import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User, Key, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [officerId, setOfficerId] = useState('OFFICER-7892');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', {
        officer_id: officerId,
        password: password
      });

      if (res.data && res.data.access_token) {
        localStorage.setItem('idshield_token', res.data.access_token);
        localStorage.setItem('idshield_user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setOfficerId('OFFICER-7892');
    setPassword('password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 30%, rgba(0, 242, 254, 0.08) 0%, transparent 60%), #070a12',
      padding: '2rem'
    }}>
      <div className="cyber-card glow" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)'
          }}>
            <Shield size={32} color="#040914" />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            IDShield <span style={{ color: 'var(--primary-cyan)' }}>AI</span>
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            AI-Powered Identity & Document Screening Platform
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--primary-cyan)', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Ministry of Home Affairs • SIH 26188
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger-red)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Security Officer ID or Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Authentication Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Remember Session
            </label>
            <span style={{ color: 'var(--primary-cyan)', cursor: 'pointer' }}>Portal Help</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating Security Token...' : (
              <>
                Authenticate & Access Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleFillDemo}
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            <Key size={14} /> Auto-fill Demo Officer Credentials
          </button>
          
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={12} color="var(--success-emerald)" /> 256-Bit Encrypted Secure Channel
          </div>
        </div>
      </div>
    </div>
  );
}
