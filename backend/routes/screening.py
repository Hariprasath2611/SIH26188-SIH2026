import os
import uuid
import json
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import ScreeningCase, BlockchainRecord
from services.ocr_service import OCRService
from services.document_service import DocumentService
from services.face_service import FaceService
from services.age_service import AgeService
from services.risk_service import RiskService
from services.blockchain_service import BlockchainService

router = APIRouter(prefix="/screening", tags=["Screening Workflow"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class OCRAnalysisRequest(BaseModel):
    image_url: str
    doc_type: str = "Passport"

class DocumentAnalysisRequest(BaseModel):
    doc_image_url: str
    ocr_data: dict

class FaceVerificationRequest(BaseModel):
    doc_image_url: str
    person_image_url: str
    ocr_data: Optional[dict] = {}

class RiskAssessmentRequest(BaseModel):
    doc_analysis: dict
    face_analysis: dict
    age_analysis: dict
    ocr_data: dict

class SaveCaseRequest(BaseModel):
    case_id: Optional[str] = None
    document_type: str
    doc_image_url: str
    person_image_url: str
    ocr_data: dict
    document_score: float
    face_score: float
    age_assessment: str
    age_delta: int
    data_consistency: str
    expiry_status: str
    risk_score: int
    risk_level: str
    risk_reasons: List[str]
    officer_decision: str = "APPROVED"
    officer_comments: Optional[str] = ""
    officer_id: str = "OFFICER-7892"

@router.post("/upload")
async def upload_files(
    doc_file: Optional[UploadFile] = File(None),
    person_file: Optional[UploadFile] = File(None),
    doc_preset: Optional[str] = Form(None)
):
    doc_url = "/static/samples/preset_passport.png"
    person_url = "/static/samples/person_matching.png"

    if doc_file:
        doc_filename = f"doc_{uuid.uuid4().hex[:8]}_{doc_file.filename}"
        doc_path = os.path.join(UPLOAD_DIR, doc_filename)
        with open(doc_path, "wb") as f:
            f.write(await doc_file.read())
        doc_url = f"/static/uploads/{doc_filename}"

    if person_file:
        person_filename = f"person_{uuid.uuid4().hex[:8]}_{person_file.filename}"
        person_path = os.path.join(UPLOAD_DIR, person_filename)
        with open(person_path, "wb") as f:
            f.write(await person_file.read())
        person_url = f"/static/uploads/{person_filename}"

    if doc_preset:
        if doc_preset == "preset_passport":
            doc_url = "/static/samples/preset_passport.png"
            person_url = "/static/samples/person_matching.png"
        elif doc_preset == "preset_license":
            doc_url = "/static/samples/preset_license.png"
            person_url = "/static/samples/person_aged.png"
        elif doc_preset == "preset_id":
            doc_url = "/static/samples/preset_id.png"
            person_url = "/static/samples/person_mismatch.png"

    return {
        "status": "SUCCESS",
        "doc_image_url": doc_url,
        "person_image_url": person_url
    }

@router.post("/ocr")
def process_ocr(req: OCRAnalysisRequest):
    extracted_fields = OCRService.extract_document_data(req.image_url, req.doc_type)
    return {
        "status": "SUCCESS",
        "ocr_data": extracted_fields
    }

@router.post("/document-analysis")
def analyze_document(req: DocumentAnalysisRequest):
    analysis = DocumentService.analyze_integrity(req.doc_image_url, req.ocr_data)
    return {
        "status": "SUCCESS",
        "analysis": analysis
    }

@router.post("/face-verification")
def verify_face(req: FaceVerificationRequest):
    face_res = FaceService.compare_faces(req.doc_image_url, req.person_image_url)
    age_res = AgeService.evaluate_aging(req.ocr_data, face_res["similarity_score"], req.doc_image_url)
    return {
        "status": "SUCCESS",
        "face_analysis": face_res,
        "age_analysis": age_res
    }

@router.post("/risk-assessment")
def calculate_risk(req: RiskAssessmentRequest):
    risk_res = RiskService.calculate_risk(
        req.doc_analysis,
        req.face_analysis,
        req.age_analysis,
        req.ocr_data
    )
    return {
        "status": "SUCCESS",
        "risk_assessment": risk_res
    }

@router.post("/save")
def save_case(req: SaveCaseRequest, db: Session = Depends(get_db)):
    case_id = req.case_id or f"ID-2026-{uuid.uuid4().hex[:5].upper()}"
    
    new_case = ScreeningCase(
        case_id=case_id,
        document_type=req.document_type,
        doc_image_url=req.doc_image_url,
        person_image_url=req.person_image_url,
        document_score=req.document_score,
        face_score=req.face_score,
        age_assessment=req.age_assessment,
        age_delta=req.age_delta,
        data_consistency=req.data_consistency,
        expiry_status=req.expiry_status,
        risk_score=req.risk_score,
        risk_level=req.risk_level,
        status="COMPLETED",
        officer_id=req.officer_id,
        officer_decision=req.officer_decision,
        officer_comments=req.officer_comments
    )
    new_case.ocr_data = req.ocr_data
    new_case.risk_reasons = req.risk_reasons

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # Generate Blockchain Audit Transaction Record
    bc_tx = BlockchainService.create_audit_transaction({
        "case_id": case_id,
        "document_type": req.document_type,
        "risk_score": req.risk_score,
        "risk_level": req.risk_level,
        "officer_id": req.officer_id,
        "officer_decision": req.officer_decision,
        "timestamp": new_case.created_at.isoformat()
    })

    bc_record = BlockchainRecord(
        case_id=case_id,
        record_hash=bc_tx["record_hash"],
        transaction_hash=bc_tx["transaction_hash"],
        block_number=bc_tx["block_number"],
        status=bc_tx["status"],
        payload_json=json.dumps(bc_tx)
    )
    db.add(bc_record)
    db.commit()

    return {
        "status": "SUCCESS",
        "case_id": case_id,
        "case": {
            "id": new_case.id,
            "case_id": new_case.case_id,
            "risk_score": new_case.risk_score,
            "risk_level": new_case.risk_level,
            "officer_decision": new_case.officer_decision
        },
        "blockchain": bc_tx
    }

@router.get("/history")
def get_screening_history(
    risk_level: Optional[str] = Query(None),
    doc_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ScreeningCase).order_by(ScreeningCase.created_at.desc())
    if risk_level and risk_level != "ALL":
        query = query.filter(ScreeningCase.risk_level == risk_level)
    if doc_type and doc_type != "ALL":
        query = query.filter(ScreeningCase.document_type == doc_type)
        
    cases = query.all()
    results = []
    for c in cases:
        bc = db.query(BlockchainRecord).filter(BlockchainRecord.case_id == c.case_id).first()
        results.append({
            "id": c.id,
            "case_id": c.case_id,
            "document_type": c.document_type,
            "date": c.created_at.strftime("%Y-%m-%d %H:%M"),
            "risk_score": c.risk_score,
            "risk_level": c.risk_level,
            "officer_decision": c.officer_decision,
            "officer_id": c.officer_id,
            "blockchain_status": bc.status if bc else "PENDING",
            "transaction_hash": bc.transaction_hash if bc else "N/A"
        })
    return {"status": "SUCCESS", "count": len(results), "cases": results}

@router.get("/{case_id}")
def get_case_details(case_id: str, db: Session = Depends(get_db)):
    c = db.query(ScreeningCase).filter(ScreeningCase.case_id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
        
    bc = db.query(BlockchainRecord).filter(BlockchainRecord.case_id == case_id).first()
    
    return {
        "status": "SUCCESS",
        "case": {
            "case_id": c.case_id,
            "document_type": c.document_type,
            "doc_image_url": c.doc_image_url,
            "person_image_url": c.person_image_url,
            "ocr_data": c.ocr_data,
            "document_score": c.document_score,
            "face_score": c.face_score,
            "age_assessment": c.age_assessment,
            "age_delta": c.age_delta,
            "data_consistency": c.data_consistency,
            "expiry_status": c.expiry_status,
            "risk_score": c.risk_score,
            "risk_level": c.risk_level,
            "risk_reasons": c.risk_reasons,
            "officer_decision": c.officer_decision,
            "officer_comments": c.officer_comments,
            "officer_id": c.officer_id,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")
        },
        "blockchain": {
            "record_hash": bc.record_hash if bc else "0x",
            "transaction_hash": bc.transaction_hash if bc else "0x",
            "block_number": bc.block_number if bc else 1,
            "timestamp": bc.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC") if bc else "N/A",
            "status": bc.status if bc else "PENDING"
        }
    }
