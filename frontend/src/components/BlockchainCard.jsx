import React from 'react';
import { ShieldCheck, Database, FileText, CheckCircle2, Lock, ExternalLink, Printer } from 'lucide-react';

export function BlockchainCard({ record }) {
  if (!record) return null;

  return (
    <div className="cyber-card glow" style={{ borderLeft: '4px solid var(--primary-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={22} color="var(--primary-cyan)" />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Blockchain Audit Ledger Proof
          </span>
        </div>
        <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={14} /> TAMPER-EVIDENT VERIFIED
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        fontSize: '0.85rem',
        background: 'rgba(2, 6, 23, 0.6)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        fontFamily: 'var(--font-mono)'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            SHA-256 Record Hash
          </div>
          <div style={{ color: 'var(--primary-cyan)', wordBreak: 'break-all', fontWeight: 600 }}>
            {record.record_hash || '0x8f31920a4b72c910e19488a09f8721c4b810a92c'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Transaction Hash
          </div>
          <div style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>
            {record.transaction_hash || '0x72ab910283719028471920847190284719ef'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Block Number
          </div>
          <div style={{ color: 'var(--success-emerald)', fontWeight: 700 }}>
            #{record.block_number || 10482}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Timestamp
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {record.timestamp || '2026-09-11 12:30:00 UTC'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Lock size={12} /> Verification data hashed cryptographically. Raw identity files are never stored on-chain.
      </div>
    </div>
  );
}

export function ReportViewer({ caseData, blockchainData, onPrint }) {
  if (!caseData) return null;

  return (
    <div className="cyber-card" style={{ background: '#0b1120', color: '#fff', border: '1px solid var(--border-glow)' }}>
      {/* Official Government Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            OFFICIAL SECURITY SCREENING REPORT
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', marginTop: '0.2rem' }}>
            IDShield AI Platform • Ministry of Home Affairs
          </div>
        </div>

        <button className="btn btn-primary no-print" onClick={onPrint}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* Grid details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Case Metadata
          </h4>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Case ID:</td><td style={{ fontWeight: 700 }}>{caseData.case_id}</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Document Type:</td><td>{caseData.document_type}</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Screening Date:</td><td>{caseData.created_at || new Date().toISOString()}</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Assigned Officer:</td><td>{caseData.officer_id || 'OFFICER-7892'}</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            AI Assessment Summary
          </h4>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Risk Score:</td><td style={{ fontWeight: 800, color: caseData.risk_level === 'HIGH' ? 'var(--danger-red)' : caseData.risk_level === 'MEDIUM' ? 'var(--warning-amber)' : 'var(--success-emerald)' }}>{caseData.risk_score}/100 ({caseData.risk_level} RISK)</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Doc Integrity:</td><td>{caseData.document_score}%</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Face Similarity:</td><td>{caseData.face_score}%</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Age-Aware Result:</td><td>{caseData.age_assessment}</td></tr>
              <tr><td style={{ color: 'var(--text-dim)', padding: '0.25rem 0' }}>Officer Decision:</td><td style={{ fontWeight: 700 }}>{caseData.officer_decision}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Extracted OCR Data */}
      <div style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h4 style={{ color: 'var(--primary-cyan)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Extracted OCR Identity Information
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div><span style={{ color: 'var(--text-dim)' }}>Name:</span> <strong>{caseData.ocr_data?.full_name}</strong></div>
          <div><span style={{ color: 'var(--text-dim)' }}>Doc Number:</span> <strong>{caseData.ocr_data?.document_number}</strong></div>
          <div><span style={{ color: 'var(--text-dim)' }}>DOB:</span> {caseData.ocr_data?.date_of_birth}</div>
          <div><span style={{ color: 'var(--text-dim)' }}>Nationality:</span> {caseData.ocr_data?.nationality}</div>
          <div><span style={{ color: 'var(--text-dim)' }}>Issue Date:</span> {caseData.ocr_data?.issue_date}</div>
          <div><span style={{ color: 'var(--text-dim)' }}>Expiry Date:</span> {caseData.ocr_data?.expiry_date}</div>
        </div>
      </div>

      {/* Reasons & Remarks */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Explainable AI Screening Findings
        </h4>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem' }}>
          {(caseData.risk_reasons || []).map((reason, idx) => (
            <li key={idx} style={{ padding: '0.35rem 0', color: reason.startsWith('✓') ? 'var(--success-emerald)' : 'var(--warning-amber)' }}>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Officer Remarks */}
      <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>OFFICER COMMENTS:</div>
        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
          "{caseData.officer_comments || 'No officer comments recorded.'}"
        </div>
      </div>

      {/* Blockchain Hash Footer */}
      {blockchainData && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <div>BLOCKCHAIN PROOF HASH: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>{blockchainData.record_hash}</span></div>
          <div>TRANSACTION HASH: <span style={{ fontFamily: 'var(--font-mono)' }}>{blockchainData.transaction_hash}</span></div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
        DISCLAIMER: AI screening provides assistive recommendations for authorized security personnel. Final legal and security actions are determined by the authorized officer. Demo prototype for SIH 2026.
      </div>
    </div>
  );
}
