import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, FilePlus, History, Database, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { StatCard, RiskBadge } from '../components/StatCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [blockchainLedger, setBlockchainLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [historyRes, bcRes] = await Promise.all([
        axios.get('/api/screening/history'),
        axios.get('/api/blockchain/ledger')
      ]);

      if (historyRes.data && historyRes.data.cases) {
        setCases(historyRes.data.cases);
      }
      if (bcRes.data && bcRes.data.ledger) {
        setBlockchainLedger(bcRes.data.ledger);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalCases = cases.length;
  const lowCount = cases.filter(c => c.risk_level === 'LOW').length;
  const medCount = cases.filter(c => c.risk_level === 'MEDIUM').length;
  const highCount = cases.filter(c => c.risk_level === 'HIGH').length;
  const flaggedCount = cases.filter(c => c.officer_decision === 'FLAGGED').length;

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">
            <Activity color="var(--primary-cyan)" /> Security Officer Command Center
          </h1>
          <div className="page-subtitle">
            Real-time AI Identity Screening & Tamper-Evident Audit Intelligence
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/new-screening')}>
          <FilePlus size={18} /> Start New Screening
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard title="Total Screenings" value={totalCases} icon={Shield} color="cyan" subtitle="Processed by AI" />
        <StatCard title="Low Risk Cases" value={lowCount} icon={CheckCircle} color="emerald" subtitle="Passed & Approved" />
        <StatCard title="Medium Risk" value={medCount} icon={AlertTriangle} color="amber" subtitle="Manual Review" />
        <StatCard title="High Risk / Flagged" value={highCount} icon={ShieldAlert} color="red" subtitle="Identity Risk" />
        <StatCard title="Blockchain Ledger" value={blockchainLedger.length} icon={Database} color="cyan" subtitle="Tamper-Evident Blocks" />
      </div>

      {/* Main Grid: Recent Screenings & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
        {/* Recent Screenings Table */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Identity Screenings
            </h3>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/history')}>
              View All History <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading screening records...
            </div>
          ) : cases.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No screening cases recorded yet.
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Document Type</th>
                    <th>Date & Time</th>
                    <th>Risk Score</th>
                    <th>Risk Level</th>
                    <th>Officer Decision</th>
                    <th>Blockchain</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.slice(0, 5).map((c) => (
                    <tr key={c.case_id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
                        {c.case_id}
                      </td>
                      <td>{c.document_type}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.date}</td>
                      <td style={{ fontWeight: 800 }}>{c.risk_score}/100</td>
                      <td><RiskBadge level={c.risk_level} /></td>
                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: c.officer_decision === 'APPROVED' ? 'var(--success-emerald)' : c.officer_decision === 'FLAGGED' ? 'var(--danger-red)' : 'var(--warning-amber)'
                        }}>
                          {c.officer_decision}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--success-emerald)' }}>
                          ● VERIFIED
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          onClick={() => navigate(`/case/${c.case_id}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Quick Actions & Risk Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="cyber-card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Risk Distribution Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--success-emerald)' }}>Low Risk</span>
                  <span>{lowCount} cases ({totalCases > 0 ? Math.round((lowCount/totalCases)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: 'var(--success-emerald)', width: `${totalCases > 0 ? (lowCount/totalCases)*100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--warning-amber)' }}>Medium Risk</span>
                  <span>{medCount} cases ({totalCases > 0 ? Math.round((medCount/totalCases)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: 'var(--warning-amber)', width: `${totalCases > 0 ? (medCount/totalCases)*100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--danger-red)' }}>High Risk</span>
                  <span>{highCount} cases ({totalCases > 0 ? Math.round((highCount/totalCases)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: 'var(--danger-red)', width: `${totalCases > 0 ? (highCount/totalCases)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Officer Shortcuts
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/new-screening')}>
                <FilePlus size={16} /> New Identity Screening
              </button>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/history')}>
                <History size={16} /> View Screening History
              </button>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/blockchain-audit')}>
                <Database size={16} /> Blockchain Audit Explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
