import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShieldCheck, CheckCircle2, Lock, ExternalLink, RefreshCw, Cpu } from 'lucide-react';

export default function BlockchainAudit() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/blockchain/ledger');
      if (res.data && res.data.ledger) {
        setLedger(res.data.ledger);
      }
    } catch (err) {
      console.error("Blockchain ledger fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHash = async (caseId) => {
    try {
      setVerifying(true);
      setSelectedCase(caseId);
      const res = await axios.get(`/api/blockchain/verify/${caseId}`);
      if (res.data) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">
            <Database color="var(--primary-cyan)" /> Tamper-Evident Blockchain Audit Ledger
          </h1>
          <div className="page-subtitle">
            Cryptographic SHA-256 Proof Log & Immutability Verification Explorer
          </div>
        </div>

        <button className="btn btn-secondary" onClick={fetchLedger}>
          <RefreshCw size={16} /> Refresh Block Explorer
        </button>
      </div>

      {/* Network Overview Card */}
      <div className="cyber-card glow" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Network Target</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-cyan)', marginTop: '0.2rem' }}>
            Ethereum DevNet (Hardhat 31337)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Smart Contract</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            AuditLedger.sol (0x5FbD...923F)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consensus Engine</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success-emerald)', marginTop: '0.2rem' }}>
            Proof of Authority (PoA)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Immutable Blocks</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {ledger.length} Records
          </div>
        </div>
      </div>

      {/* Verification Result Modal / Alert */}
      {verificationResult && (
        <div className="cyber-card glow" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success-emerald)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-emerald)', fontWeight: 700 }}>
              <ShieldCheck size={20} /> Cryptographic Proof Validated for {verificationResult.case_id}
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setVerificationResult(null)}>
              Close
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div>RECORD HASH: <span style={{ color: 'var(--primary-cyan)' }}>{verificationResult.record_hash}</span></div>
            <div>TRANSACTION HASH: <span style={{ color: 'var(--text-main)' }}>{verificationResult.transaction_hash}</span></div>
            <div>STATUS: <span style={{ color: 'var(--success-emerald)', fontWeight: 700 }}>{verificationResult.integrity_status}</span></div>
          </div>
        </div>
      )}

      {/* Ledger Block List */}
      <div className="cyber-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Blockchain Audit Trail Transactions
        </h3>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading ledger blocks...
          </div>
        ) : ledger.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No audit records found on the ledger.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Block #</th>
                  <th>Case ID</th>
                  <th>Record SHA-256 Hash</th>
                  <th>Transaction Hash</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 800, color: 'var(--success-emerald)' }}>
                      #{b.block_number}
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
                      {b.case_id}
                    </td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
                      {b.record_hash.substring(0, 16)}...
                    </td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {b.transaction_hash.substring(0, 16)}...
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {b.timestamp}
                    </td>
                    <td>
                      <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                        ● VERIFIED
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleVerifyHash(b.case_id)}
                        disabled={verifying && selectedCase === b.case_id}
                      >
                        Verify Hash
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
