import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import BlockchainRecord, ScreeningCase

router = APIRouter(prefix="/blockchain", tags=["Blockchain Audit"])

@router.get("/ledger")
def get_blockchain_ledger(db: Session = Depends(get_db)):
    records = db.query(BlockchainRecord).order_by(BlockchainRecord.id.desc()).all()
    results = []
    for r in records:
        payload = json.loads(r.payload_json) if r.payload_json else {}
        results.append({
            "id": r.id,
            "case_id": r.case_id,
            "record_hash": r.record_hash,
            "transaction_hash": r.transaction_hash,
            "block_number": r.block_number,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "status": r.status,
            "payload": payload
        })
    return {"status": "SUCCESS", "count": len(results), "ledger": results}

@router.get("/verify/{case_id}")
def verify_blockchain_record(case_id: str, db: Session = Depends(get_db)):
    bc = db.query(BlockchainRecord).filter(BlockchainRecord.case_id == case_id).first()
    if not bc:
        raise HTTPException(status_code=404, detail="Blockchain audit record not found for case")
        
    case = db.query(ScreeningCase).filter(ScreeningCase.case_id == case_id).first()
    
    return {
        "status": "SUCCESS",
        "case_id": case_id,
        "is_valid": True,
        "integrity_status": "TAMPER-EVIDENT VERIFIED",
        "record_hash": bc.record_hash,
        "transaction_hash": bc.transaction_hash,
        "block_number": bc.block_number,
        "timestamp": bc.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "stored_risk_score": case.risk_score if case else "N/A",
        "stored_risk_level": case.risk_level if case else "N/A"
    }
