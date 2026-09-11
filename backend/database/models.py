from datetime import datetime
import json
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    officer_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Security Officer")
    department = Column(String(100), default="Immigration & Border Security")
    created_at = Column(DateTime, default=datetime.utcnow)

class ScreeningCase(Base):
    __tablename__ = "screening_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), unique=True, index=True, nullable=False)
    document_type = Column(String(50), nullable=False) # Passport, Visa, National ID, Driving License
    
    doc_image_url = Column(String(255), nullable=True)
    person_image_url = Column(String(255), nullable=True)
    
    ocr_data_json = Column(Text, nullable=True) # Serialized dict of OCR fields
    
    document_score = Column(Float, default=100.0) # Integrity score (0-100)
    face_score = Column(Float, default=100.0) # Face match score (0-100)
    age_assessment = Column(String(100), default="PASS")
    age_delta = Column(Integer, default=0)
    data_consistency = Column(String(50), default="PASS")
    expiry_status = Column(String(50), default="VALID")
    
    risk_score = Column(Integer, default=0) # 0 to 100
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH
    risk_reasons_json = Column(Text, nullable=True) # Array of strings
    
    status = Column(String(50), default="COMPLETED")
    officer_id = Column(String(50), default="OFFICER-7892")
    officer_decision = Column(String(50), default="APPROVED") # APPROVED, MANUAL_VERIFICATION, FLAGGED
    officer_comments = Column(Text, nullable=True)
    
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def ocr_data(self):
        return json.loads(self.ocr_data_json) if self.ocr_data_json else {}

    @ocr_data.setter
    def ocr_data(self, value):
        self.ocr_data_json = json.dumps(value)

    @property
    def risk_reasons(self):
        return json.loads(self.risk_reasons_json) if self.risk_reasons_json else []

    @risk_reasons.setter
    def risk_reasons(self, value):
        self.risk_reasons_json = json.dumps(value)

class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), index=True, nullable=False)
    record_hash = Column(String(66), nullable=False) # SHA-256 / keccak256
    transaction_hash = Column(String(66), nullable=False)
    block_number = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="VERIFIED")
    payload_json = Column(Text, nullable=True)
