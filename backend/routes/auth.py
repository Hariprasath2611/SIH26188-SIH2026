from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User
from services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    officer_id: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Demo credentials check
    if req.officer_id.lower() in ["officer-7892", "admin", "officer@sih.gov.in"]:
        user = db.query(User).filter(User.officer_id == "OFFICER-7892").first()
        if not user:
            # Seed default demo officer user
            user = User(
                officer_id="OFFICER-7892",
                name="Inspector Rajesh Kumar",
                email="r.kumar@immigration.gov.in",
                password_hash=AuthService.get_password_hash("password123"),
                role="Senior Security Officer",
                department="Bureau of Immigration, MHA"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token = AuthService.create_access_token({"sub": user.officer_id, "role": user.role})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "officer_id": user.officer_id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "department": user.department
            }
        }
    
    # Standard DB user lookup
    user = db.query(User).filter(User.officer_id == req.officer_id).first()
    if not user or not AuthService.verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Officer Credentials"
        )
        
    token = AuthService.create_access_token({"sub": user.officer_id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "officer_id": user.officer_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department
        }
    }
