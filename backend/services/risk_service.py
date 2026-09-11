class RiskService:
    """
    Weighted Risk Assessment Engine for IDShield AI.
    Calculates an explainable 0-100 risk score and categorizes case into LOW, MEDIUM, or HIGH risk.
    
    Weighting Matrix:
      - Document Integrity:  40%
      - Face Verification:   30%
      - Data Consistency:    20%
      - Validity Checks:     10%
    """

    @staticmethod
    def calculate_risk(doc_analysis: dict, face_analysis: dict, age_analysis: dict, ocr_data: dict) -> dict:
        reasons = []
        
        # 1. Document Integrity (40% weight) -> Convert score (0-100) to risk penalty
        doc_score = doc_analysis.get("integrity_score", 100.0)
        doc_risk_penalty = ((100.0 - doc_score) / 100.0) * 40.0

        # 2. Face Verification (30% weight) -> Convert match (0-100) to risk penalty
        face_sim = face_analysis.get("similarity_score", 100.0)
        # Adjust for age awareness
        if age_analysis.get("status_code") == "PASS" and face_sim >= 70.0:
            effective_face_sim = min(100.0, face_sim + 15.0) # Bonus for age-adapted match
        else:
            effective_face_sim = face_sim

        face_risk_penalty = ((100.0 - effective_face_sim) / 100.0) * 30.0

        # 3. Data Consistency (20% weight)
        data_consistency = doc_analysis.get("data_consistency", "PASS")
        if data_consistency == "PASS":
            data_penalty = 0.0
        else:
            data_penalty = 20.0
            reasons.append("⚠ Data inconsistency detected across document fields and checksums.")

        # 4. Validity Checks (10% weight)
        expiry_status = doc_analysis.get("expiry_status", "VALID")
        if expiry_status == "VALID":
            validity_penalty = 0.0
        else:
            validity_penalty = 10.0
            reasons.append("⚠ Document expiry date has passed.")

        # Total Risk Score (0 = Clean, 100 = Critical Fraud Risk)
        total_risk = round(doc_risk_penalty + face_risk_penalty + data_penalty + validity_penalty)
        total_risk = max(0, min(100, total_risk))

        # Categorize Risk Level
        if total_risk <= 29:
            risk_level = "LOW"
            if not reasons:
                reasons.append("✓ Document structure and security patterns appear authentic.")
                reasons.append("✓ Extracted information is internally consistent.")
                reasons.append("✓ Face similarity is acceptable and age-aligned.")
                reasons.append("✓ Document validity period is active.")
        elif total_risk <= 69:
            risk_level = "MEDIUM"
            if face_sim < 80.0:
                reasons.append(f"⚠ Moderate face similarity score ({face_sim:.1f}%). Manual verification recommended.")
            if doc_score < 90.0:
                reasons.append("⚠ Minor visual or compression anomalies detected on document surface.")
        else:
            risk_level = "HIGH"
            if face_sim < 50.0:
                reasons.append(f"⚠ Critical facial mismatch detected ({face_sim:.1f}% similarity).")
            if doc_score < 70.0:
                reasons.append("⚠ Document image manipulation or photo tampering detected.")

        return {
            "risk_score": total_risk,
            "risk_level": risk_level,
            "reasons": reasons,
            "breakdown": {
                "document_integrity_weight": 40,
                "document_integrity_score": doc_score,
                "face_verification_weight": 30,
                "face_similarity_score": face_sim,
                "data_consistency_weight": 20,
                "data_consistency_status": data_consistency,
                "validity_check_weight": 10,
                "expiry_status": expiry_status
            },
            "disclaimer": "AI provides assistive screening recommendations; final action is taken by the authorized security officer."
        }
