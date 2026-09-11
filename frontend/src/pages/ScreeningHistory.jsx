import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { History, Search, Filter, ShieldCheck, Database } from 'lucide-react';
import { RiskBadge } from '../components/StatCard';

export default function ScreeningHistory() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [docFilter, setDocFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [riskFilter, docFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/screening/history', {
        params: {
          risk_level: riskFilter,
          doc_type: docFilter
        }
      });
      if (res.data && res.data.cases) {
        setCases(res.data.cases);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => 
    c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.officer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <History color="var(--primary-cyan)" /> Screening Verification History
        </h1>
        <div className="page-subtitle">
          Comprehensive Audit Archive of All Verified Cases & Blockchain Hashes
        </div>
      </div>

      {/* Filters Bar */}
      <div className="cyber-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search Case ID, Document Type, or Officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Risk Level:</label>
          <select className="form-control" style={{ width: '130px' }} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Document:</label>
          <select className="form-control" style={{ width: '150px' }} value={docFilter} onChange={(e) => setDocFilter(e.target.value)}>
            <option value="ALL">All Documents</option>
            <option value="Passport">Passport</option>
            <option value="Visa">Visa</option>
            <option value="National ID">National ID</option>
            <option value="Driving License">Driving License</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="cyber-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading screening history records...
          </div>
        ) : filteredCases.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No verification cases match your query filters.
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
                  <th>Blockchain Hash</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
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
                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {c.transaction_hash?.substring(0, 10)}...
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        onClick={() => navigate(`/case/${c.case_id}`)}
                      >
                        View Report
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
