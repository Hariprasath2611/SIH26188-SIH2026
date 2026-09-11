import React from 'react';
import { UserCheck, Shield, Key, Building, Mail, Award, CheckCircle } from 'lucide-react';

export default function Profile({ user }) {
  const officer = user || {
    name: "Inspector Rajesh Kumar",
    officer_id: "OFFICER-7892",
    email: "r.kumar@immigration.gov.in",
    role: "Senior Security Officer",
    department: "Bureau of Immigration, Ministry of Home Affairs"
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <UserCheck color="var(--primary-cyan)" /> Security Officer Profile
        </h1>
        <div className="page-subtitle">
          Authorized Credentials & Security Screening Clearance Matrix
        </div>
      </div>

      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div className="cyber-card glow" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#040914',
              fontWeight: 900,
              fontSize: '1.75rem'
            }}>
              RK
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{officer.name}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
                {officer.role}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Officer ID: <strong style={{ fontFamily: 'var(--font-mono)' }}>{officer.officer_id}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Department</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {officer.department}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Government Email</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '0.25rem' }}>
                {officer.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Clearance Level</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--success-emerald)', marginTop: '0.25rem' }}>
                ● LEVEL-4 TOP SECRET (BORDER SECURITY)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Blockchain Signer Key</div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)', marginTop: '0.25rem' }}>
                0x7892...B410 (Active)
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 242, 254, 0.04)', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.15)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={16} color="var(--success-emerald)" style={{ display: 'inline', marginRight: '0.4rem' }} />
            Authenticated under MHA Cyber Security Protocol 2026. All actions are logged to the tamper-evident audit ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
