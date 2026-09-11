import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, ArrowLeft, Printer, Database, FileCheck, AlertTriangle, Lock } from 'lucide-react';
import { RiskGauge, RiskBadge } from '../components/StatCard';
import { BlockchainCard, ReportViewer } from '../components/BlockchainCard';

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/screening/${caseId}`);
      if (res.data && res.data.status === 'SUCCESS') {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Case report not found.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Fetching Case Analysis Data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--danger-red)', marginBottom: '1rem' }}>{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/history')}>
          <ArrowLeft size={16} /> Return to History
        </button>
      </div>
    );
  }

  const { case: caseInfo, blockchain } = data;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <button className="btn btn-secondary no-print" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }} onClick={() => navigate('/history')}>
            <ArrowLeft size={14} /> Back to Screening History
          </button>
          <h1 className="page-title">
            <Shield color="var(--primary-cyan)" /> Case Report: {caseInfo.case_id}
          </h1>
          <div className="page-subtitle">
            Audited Identity Screening Record • MHA Security Intelligence
          </div>
        </div>

        <button className="btn btn-primary no-print" onClick={handlePrint}>
          <Printer size={16} /> Export Official PDF Report
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Printable Report Component */}
        <ReportViewer caseData={caseInfo} blockchainData={blockchain} onPrint={handlePrint} />

        {/* Blockchain Ledger Proof Card */}
        <BlockchainCard record={blockchain} />

        {/* Image Assets Preview */}
        <div className="cyber-card no-print">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Screened Visual Assets
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DOCUMENT IMAGE</div>
              <img src={caseInfo.doc_image_url} alt="Document" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PERSON LIVE PHOTO</div>
              <img src={caseInfo.person_image_url} alt="Person" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
