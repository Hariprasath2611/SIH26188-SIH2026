import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, FilePlus, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Database, Lock, Eye, Edit2, FileText, Check, ShieldAlert } from 'lucide-react';
import { UploadBox, FaceComparison } from '../components/UploadBox';
import { RiskGauge, RiskBadge } from '../components/StatCard';
import { BlockchainCard } from '../components/BlockchainCard';

export default function NewScreening() {
  const navigate = useNavigate();
  
  // Step State (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form & Workflow Data
  const [docType, setDocType] = useState('Passport');
  const [docImageUrl, setDocImageUrl] = useState('/static/samples/preset_passport.png');
  const [personImageUrl, setPersonImageUrl] = useState('/static/samples/person_matching.png');
  
  // OCR Extracted Data
  const [ocrData, setOcrData] = useState({
    full_name: 'JOHNATHAN DOE',
    document_number: 'P-98421057',
    nationality: 'IND',
    date_of_birth: '1988-04-14',
    gender: 'M',
    issue_date: '2021-06-10',
    expiry_date: '2031-06-09',
    issuing_authority: 'REPUBLIC OF INDIA'
  });

  // Analysis Results
  const [docAnalysis, setDocAnalysis] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [ageAnalysis, setAgeAnalysis] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);

  // Officer Decision & Comments
  const [officerDecision, setOfficerDecision] = useState('APPROVED');
  const [officerComments, setOfficerComments] = useState('Verified against physical document. Clear to pass.');

  // Final Saved Result
  const [savedResult, setSavedResult] = useState(null);

  // Step 1 -> 2: Upload Files or Preset Selection
  const handleSelectPreset = (presetName) => {
    if (presetName === 'preset_passport') {
      setDocType('Passport');
      setDocImageUrl('/static/samples/preset_passport.png');
      setPersonImageUrl('/static/samples/person_matching.png');
    } else if (presetName === 'preset_license') {
      setDocType('Driving License');
      setDocImageUrl('/static/samples/preset_license.png');
      setPersonImageUrl('/static/samples/person_aged.png');
    } else if (presetName === 'preset_id') {
      setDocType('National ID');
      setDocImageUrl('/static/samples/preset_id.png');
      setPersonImageUrl('/static/samples/person_mismatch.png');
    }
  };

  // Step 2 -> 3: Process OCR
  const handleRunOCR = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/screening/ocr', {
        image_url: docImageUrl,
        doc_type: docType
      });
      if (res.data && res.data.ocr_data) {
        setOcrData(res.data.ocr_data);
      }
      setCurrentStep(3);
    } catch (err) {
      console.error("OCR error:", err);
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 -> 4: Run Document & Face & Risk AI Analysis
  const handleRunAIAnalysis = async () => {
    setLoading(true);
    try {
      // 1. Doc Analysis
      const docRes = await axios.post('/api/screening/document-analysis', {
        doc_image_url: docImageUrl,
        ocr_data: ocrData
      });
      setDocAnalysis(docRes.data.analysis);

      // 2. Face & Age Verification
      const faceRes = await axios.post('/api/screening/face-verification', {
        doc_image_url: docImageUrl,
        person_image_url: personImageUrl,
        ocr_data: ocrData
      });
      setFaceAnalysis(faceRes.data.face_analysis);
      setAgeAnalysis(faceRes.data.age_analysis);

      // 3. Risk Assessment
      const riskRes = await axios.post('/api/screening/risk-assessment', {
        doc_analysis: docRes.data.analysis,
        face_analysis: faceRes.data.face_analysis,
        age_analysis: faceRes.data.age_analysis,
        ocr_data: ocrData
      });
      setRiskAssessment(riskRes.data.risk_assessment);

      // Default officer decision based on risk level
      const level = riskRes.data.risk_assessment.risk_level;
      if (level === 'LOW') {
        setOfficerDecision('APPROVED');
        setOfficerComments('Verified document and facial match. Clear to proceed.');
      } else if (level === 'MEDIUM') {
        setOfficerDecision('MANUAL_VERIFICATION');
        setOfficerComments('Requested secondary ID check due to aging gap.');
      } else {
        setOfficerDecision('FLAGGED');
        setOfficerComments('Flagged due to facial mismatch and expiry date anomaly.');
      }

      setCurrentStep(4);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 5 -> 6: Submit Officer Review & Generate Blockchain Audit Ledger
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        document_type: docType,
        doc_image_url: docImageUrl,
        person_image_url: personImageUrl,
        ocr_data: ocrData,
        document_score: docAnalysis?.integrity_score || 92.0,
        face_score: faceAnalysis?.similarity_score || 82.0,
        age_assessment: ageAnalysis?.assessment || 'PASS',
        age_delta: ageAnalysis?.estimated_age_delta || 0,
        data_consistency: docAnalysis?.data_consistency || 'PASS',
        expiry_status: docAnalysis?.expiry_status || 'VALID',
        risk_score: riskAssessment?.risk_score || 14,
        risk_level: riskAssessment?.risk_level || 'LOW',
        risk_reasons: riskAssessment?.reasons || [],
        officer_decision: officerDecision,
        officer_comments: officerComments,
        officer_id: 'OFFICER-7892'
      };

      const res = await axios.post('/api/screening/save', payload);
      if (res.data && res.data.status === 'SUCCESS') {
        setSavedResult(res.data);
        setCurrentStep(6);
      }
    } catch (err) {
      console.error("Save case error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <Shield color="var(--primary-cyan)" /> New Identity & Document Screening
        </h1>
        <div className="page-subtitle">
          6-Stage Assisted Screening Workflow with Explainable AI & Blockchain Proof
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="stepper">
        <div className={`step-item ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
          <div className="step-number">{currentStep > 1 ? <Check size={14} /> : 1}</div>
          <span>Document</span>
        </div>
        <div className={`step-item ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}`}>
          <div className="step-number">{currentStep > 2 ? <Check size={14} /> : 2}</div>
          <span>Person Photo</span>
        </div>
        <div className={`step-item ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}`}>
          <div className="step-number">{currentStep > 3 ? <Check size={14} /> : 3}</div>
          <span>OCR Data</span>
        </div>
        <div className={`step-item ${currentStep >= 4 ? (currentStep > 4 ? 'completed' : 'active') : ''}`}>
          <div className="step-number">{currentStep > 4 ? <Check size={14} /> : 4}</div>
          <span>AI Analysis</span>
        </div>
        <div className={`step-item ${currentStep >= 5 ? (currentStep > 5 ? 'completed' : 'active') : ''}`}>
          <div className="step-number">{currentStep > 5 ? <Check size={14} /> : 5}</div>
          <span>Officer Review</span>
        </div>
        <div className={`step-item ${currentStep >= 6 ? 'completed active' : ''}`}>
          <div className="step-number">6</div>
          <span>Blockchain Proof</span>
        </div>
      </div>

      {/* STEP 1: DOCUMENT UPLOAD */}
      {currentStep === 1 && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="cyber-card" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Document Category</label>
            <select
              className="form-control"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="Passport">International Passport</option>
              <option value="Visa">Travel Visa Document</option>
              <option value="National ID">National ID Card</option>
              <option value="Driving License">State Driving Licence</option>
            </select>
          </div>

          <UploadBox
            title="Step 1 — Upload Document Image"
            subtitle="Upload front page of synthetic travel or identity document"
            previewUrl={docImageUrl}
            onFileSelect={(file) => setDocImageUrl(URL.createObjectURL(file))}
            onSelectPreset={handleSelectPreset}
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
              Proceed to Person Verification <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PERSON VERIFICATION */}
      {currentStep === 2 && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <UploadBox
            title="Step 2 — Person Live Photo Capture"
            subtitle="Upload or capture current face photograph of the person being screened"
            previewUrl={personImageUrl}
            onFileSelect={(file) => setPersonImageUrl(URL.createObjectURL(file))}
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleRunOCR} disabled={loading}>
              {loading ? 'Extracting OCR Fields...' : (
                <>
                  Run AI OCR Extraction <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OCR EXTRACTION */}
      {currentStep === 3 && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="cyber-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Step 3 — AI Extracted OCR Data
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Fields extracted automatically by PaddleOCR. Review or edit if necessary.
                </div>
              </div>
              <span className="badge badge-cyan">AI Extracted Data</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.full_name || ''}
                  onChange={(e) => setOcrData({ ...ocrData, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.document_number || ''}
                  onChange={(e) => setOcrData({ ...ocrData, document_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth (YYYY-MM-DD)</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.date_of_birth || ''}
                  onChange={(e) => setOcrData({ ...ocrData, date_of_birth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.nationality || ''}
                  onChange={(e) => setOcrData({ ...ocrData, nationality: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.issue_date || ''}
                  onChange={(e) => setOcrData({ ...ocrData, issue_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={ocrData.expiry_date || ''}
                  onChange={(e) => setOcrData({ ...ocrData, expiry_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleRunAIAnalysis} disabled={loading}>
              {loading ? 'Analyzing Document Forensics & Facial Match...' : (
                <>
                  Execute Document & Face Analysis <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ANALYSIS & RISK ASSESSMENT */}
      {currentStep === 4 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Risk Gauge */}
            <div className="cyber-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', textAlign: 'center' }}>
                AI Explainable Risk Score
              </h3>
              <RiskGauge score={riskAssessment?.risk_score || 14} level={riskAssessment?.risk_level || 'LOW'} />
              
              <div style={{ marginTop: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Risk Factor Breakdown:
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Document Integrity (40%):</span> <strong>{docAnalysis?.integrity_score}%</strong>
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Face Similarity (30%):</span> <strong>{faceAnalysis?.similarity_score}%</strong>
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Data Consistency (20%):</span> <strong style={{ color: docAnalysis?.data_consistency === 'PASS' ? 'var(--success-emerald)' : 'var(--danger-red)' }}>{docAnalysis?.data_consistency}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Validity Check (10%):</span> <strong style={{ color: docAnalysis?.expiry_status === 'VALID' ? 'var(--success-emerald)' : 'var(--danger-red)' }}>{docAnalysis?.expiry_status}</strong>
                </div>
              </div>
            </div>

            {/* Explainable Reasons */}
            <div className="cyber-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Why This Result?
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(riskAssessment?.reasons || []).map((reason, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      background: reason.startsWith('✓') ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      borderLeft: `4px solid ${reason.startsWith('✓') ? 'var(--success-emerald)' : 'var(--warning-amber)'}`,
                      color: '#fff'
                    }}
                  >
                    {reason}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.04)', border: '1px solid rgba(0, 242, 254, 0.15)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                💡 <strong>Assistive Recommendation</strong>: AI provides recommendations; final legal and security decisions remain with the security officer.
              </div>
            </div>
          </div>

          {/* Face Comparison Visual */}
          <FaceComparison
            docImage={docImageUrl}
            personImage={personImageUrl}
            faceAnalysis={faceAnalysis}
            ageAnalysis={ageAnalysis}
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
              <ArrowLeft size={16} /> Back to OCR
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(5)}>
              Proceed to Officer Review <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: OFFICER REVIEW & DECISION */}
      {currentStep === 5 && (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="cyber-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Step 5 — Security Officer Determination
            </h3>

            <div className="form-group">
              <label className="form-label">Officer Final Decision</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  className={`btn ${officerDecision === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOfficerDecision('APPROVED')}
                >
                  ✓ Approve / Clear
                </button>
                <button
                  type="button"
                  className={`btn ${officerDecision === 'MANUAL_VERIFICATION' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOfficerDecision('MANUAL_VERIFICATION')}
                >
                  ▲ Request Manual Check
                </button>
                <button
                  type="button"
                  className={`btn ${officerDecision === 'FLAGGED' ? 'btn-outline-danger' : 'btn-secondary'}`}
                  onClick={() => setOfficerDecision('FLAGGED')}
                >
                  ✖ Flag for Investigation
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Officer Official Remarks / Justification</label>
              <textarea
                className="form-control"
                rows="4"
                value={officerComments}
                onChange={(e) => setOfficerComments(e.target.value)}
                placeholder="Enter official security remarks..."
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '1rem' }}>
              Officer ID: <strong>OFFICER-7892</strong> • Timestamp: <strong>{new Date().toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(4)}>
              <ArrowLeft size={16} /> Back to Analysis
            </button>
            <button className="btn btn-primary" onClick={handleFinalSubmit} disabled={loading}>
              {loading ? 'Generating Blockchain Audit Ledger...' : (
                <>
                  <Lock size={16} /> Submit & Create Blockchain Proof <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: BLOCKCHAIN AUDIT & CASE COMPLETE */}
      {currentStep === 6 && savedResult && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="cyber-card" style={{ textAlign: 'center', marginBottom: '1.5rem', borderHeader: '4px solid var(--success-emerald)' }}>
            <CheckCircle2 size={48} color="var(--success-emerald)" style={{ marginBottom: '0.75rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              Screening Complete & Audited
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Case ID: <strong style={{ color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)' }}>{savedResult.case_id}</strong>
            </div>
          </div>

          <BlockchainCard record={savedResult.blockchain} />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate(`/case/${savedResult.case_id}`)}>
              View Full Detailed Case Report
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Return to Command Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
