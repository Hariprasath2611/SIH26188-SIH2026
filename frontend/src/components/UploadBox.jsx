import React from 'react';
import { Upload, FileCheck, Camera } from 'lucide-react';

export function UploadBox({ title, subtitle, onFileSelect, previewUrl, onSelectPreset }) {
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="cyber-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {subtitle}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed var(--border-glow)',
          borderRadius: '10px',
          padding: '2rem 1.5rem',
          background: 'rgba(0, 242, 254, 0.02)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '1rem'
        }}
        onClick={() => document.getElementById(`file-input-${title}`).click()}
      >
        <input
          id={`file-input-${title}`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        
        {previewUrl ? (
          <div>
            <img
              src={previewUrl}
              alt="Uploaded document preview"
              style={{
                maxHeight: '180px',
                maxWidth: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--success-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <FileCheck size={16} /> File Selected / Preview Loaded
            </div>
          </div>
        ) : (
          <div>
            <Upload size={36} color="var(--primary-cyan)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
              Drag & Drop Image Here
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Supports PNG, JPG, JPEG up to 10MB
            </div>
          </div>
        )}
      </div>

      {onSelectPreset && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            OR Quick-Load Demo Presets:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => onSelectPreset('preset_passport')}
            >
              Passport (Low Risk)
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => onSelectPreset('preset_license')}
            >
              Driving License (Aged)
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => onSelectPreset('preset_id')}
            >
              National ID (Tampered)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FaceComparison({ docImage, personImage, faceAnalysis, ageAnalysis }) {
  return (
    <div className="cyber-card">
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
        Facial & Age-Aware Verification
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            DOCUMENT PHOTOGRAPH
          </div>
          <img
            src={docImage}
            alt="Document Photo"
            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            CURRENT LIVE FACE PHOTO
          </div>
          <img
            src={personImage}
            alt="Person Photo"
            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          />
        </div>
      </div>

      {faceAnalysis && (
        <div style={{
          background: 'rgba(0, 242, 254, 0.04)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: '8px',
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Face Similarity Score
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-cyan)' }}>
              {faceAnalysis.similarity_score}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Match Status: <strong>{faceAnalysis.match_status}</strong>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Age-Aware Assessment
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success-emerald)', marginTop: '0.2rem' }}>
              {ageAnalysis?.assessment || 'PASS'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Estimated Age Delta: <strong>+{ageAnalysis?.estimated_age_delta || 0} years</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
