import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import ScreeningCase, BlockchainRecord, User
from services.auth_service import AuthService
from services.blockchain_service import BlockchainService

router = APIRouter(prefix="/demo", tags=["Demo Simulation"])

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    # 1. Seed Officer
    officer = db.query(User).filter(User.officer_id == "OFFICER-7892").first()
    if not officer:
        officer = User(
            officer_id="OFFICER-7892",
            name="Inspector Rajesh Kumar",
            email="r.kumar@immigration.gov.in",
            password_hash=AuthService.get_password_hash("password123"),
            role="Senior Security Officer",
            department="Bureau of Immigration, MHA"
        )
        db.add(officer)
        db.commit()

    # Check existing cases
    existing_count = db.query(ScreeningCase).count()
    if existing_count > 0:
        return {"status": "SUCCESS", "message": "Demo data already seeded", "count": existing_count}

    demo_cases = [
        {
            "case_id": "ID-2026-00124",
            "document_type": "Passport",
            "doc_image_url": "/static/samples/preset_passport.png",
            "person_image_url": "/static/samples/person_matching.png",
            "ocr_data": {
                "full_name": "JOHNATHAN DOE",
                "document_number": "P-98421057",
                "nationality": "IND",
                "date_of_birth": "1988-04-14",
                "gender": "M",
                "issue_date": "2021-06-10",
                "expiry_date": "2031-06-09",
                "issuing_authority": "REPUBLIC OF INDIA"
            },
            "document_score": 98.4,
            "face_score": 88.5,
            "age_assessment": "MATCH VERIFIED",
            "age_delta": 3,
            "data_consistency": "PASS",
            "expiry_status": "VALID",
            "risk_score": 12,
            "risk_level": "LOW",
            "risk_reasons": [
                "✓ Document structure and security patterns appear authentic.",
                "✓ Extracted information is internally consistent.",
                "✓ Face similarity is acceptable and age-aligned.",
                "✓ Document validity period is active."
            ],
            "officer_decision": "APPROVED",
            "officer_comments": "Verified against physical document. Clear to pass.",
            "created_at": datetime.utcnow() - timedelta(hours=5)
        },
        {
            "case_id": "ID-2026-00125",
            "document_type": "Driving License",
            "doc_image_url": "/static/samples/preset_license.png",
            "person_image_url": "/static/samples/person_aged.png",
            "ocr_data": {
                "full_name": "ELENA ROSTOVA",
                "document_number": "DL-773419082",
                "nationality": "IND",
                "date_of_birth": "1976-11-22",
                "gender": "F",
                "issue_date": "2012-03-15",
                "expiry_date": "2032-03-14",
                "issuing_authority": "TRANSPORT DEPT DELHI"
            },
            "document_score": 89.0,
            "face_score": 78.0,
            "age_assessment": "POSSIBLE MATCH (AGE ADAPTED)",
            "age_delta": 14,
            "data_consistency": "PASS",
            "expiry_status": "VALID",
            "risk_score": 48,
            "risk_level": "MEDIUM",
            "risk_reasons": [
                "⚠ Moderate face similarity score (78.0%). Natural aging consistent over 14-year issuance gap.",
                "⚠ Minor surface wear on physical card. Manual officer inspection recommended."
            ],
            "officer_decision": "MANUAL_VERIFICATION",
            "officer_comments": "Requested secondary identification to verify aging progression.",
            "created_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "case_id": "ID-2026-00126",
            "document_type": "National ID",
            "doc_image_url": "/static/samples/preset_id.png",
            "person_image_url": "/static/samples/person_mismatch.png",
            "ocr_data": {
                "full_name": "MARCUS VANCE",
                "document_number": "NID-44019283",
                "nationality": "IND",
                "date_of_birth": "1994-08-05",
                "gender": "M",
                "issue_date": "2020-01-10",
                "expiry_date": "2024-01-09",
                "issuing_authority": "MINISTRY OF HOME AFFAIRS"
            },
            "document_score": 58.0,
            "face_score": 38.5,
            "age_assessment": "PROBABLE IDENTITY MISMATCH",
            "age_delta": 4,
            "data_consistency": "FAIL",
            "expiry_status": "EXPIRED",
            "risk_score": 87,
            "risk_level": "HIGH",
            "risk_reasons": [
                "⚠ Critical facial mismatch detected (38.5% similarity).",
                "⚠ Document image manipulation or photo box alteration detected.",
                "⚠ Data inconsistency detected across fields and font pixel variance.",
                "⚠ Document expiry date has passed (Expired 2024-01-09)."
            ],
            "officer_decision": "FLAGGED",
            "officer_comments": "Individual detained for questioning. Case referred to fraud investigation division.",
            "created_at": datetime.utcnow() - timedelta(minutes=45)
        }
    ]

    for item in demo_cases:
        case = ScreeningCase(
            case_id=item["case_id"],
            document_type=item["document_type"],
            doc_image_url=item["doc_image_url"],
            person_image_url=item["person_image_url"],
            document_score=item["document_score"],
            face_score=item["face_score"],
            age_assessment=item["age_assessment"],
            age_delta=item["age_delta"],
            data_consistency=item["data_consistency"],
            expiry_status=item["expiry_status"],
            risk_score=item["risk_score"],
            risk_level=item["risk_level"],
            officer_decision=item["officer_decision"],
            officer_comments=item["officer_comments"],
            officer_id="OFFICER-7892",
            created_at=item["created_at"]
        )
        case.ocr_data = item["ocr_data"]
        case.risk_reasons = item["risk_reasons"]
        db.add(case)
        db.commit()
        db.refresh(case)

        bc_tx = BlockchainService.create_audit_transaction({
            "case_id": item["case_id"],
            "document_type": item["document_type"],
            "risk_score": item["risk_score"],
            "risk_level": item["risk_level"],
            "officer_id": "OFFICER-7892",
            "officer_decision": item["officer_decision"],
            "timestamp": item["created_at"].isoformat()
        })

        bc_rec = BlockchainRecord(
            case_id=item["case_id"],
            record_hash=bc_tx["record_hash"],
            transaction_hash=bc_tx["transaction_hash"],
            block_number=bc_tx["block_number"],
            status=bc_tx["status"],
            payload_json=json.dumps(bc_tx)
        )
        db.add(bc_rec)
        db.commit()

    return {"status": "SUCCESS", "message": "3 demo cases seeded successfully", "count": 3}
