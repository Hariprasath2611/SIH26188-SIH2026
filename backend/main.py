import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database.db import engine, Base, SessionLocal
from database.models import User
from routes import auth, screening, blockchain, demo
from services.auth_service import AuthService

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IDShield AI — Identity & Document Screening API",
    description="AI-Powered Fake Identity & Document Screening System (SIH 26188, Ministry of Home Affairs)",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
SAMPLES_DIR = os.path.join(os.path.dirname(BASE_DIR), "sample-data")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

app.mount("/static/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/static/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")

# Include Routers
app.include_router(auth.router)
app.include_router(screening.router)
app.include_router(blockchain.router)
app.include_router(demo.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Seed default officer if not present
        officer = db.query(User).filter(User.officer_id == "OFFICER-7892").first()
        if not officer:
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
            
        # Automatically trigger demo seed if database is empty
        demo.seed_demo_data(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "system": "IDShield AI",
        "subtitle": "AI-Powered Identity & Document Screening Platform",
        "sih_problem_statement": "SIH 26188",
        "organization": "Ministry of Home Affairs",
        "status": "OPERATIONAL",
        "demo_mode": "ACTIVE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
