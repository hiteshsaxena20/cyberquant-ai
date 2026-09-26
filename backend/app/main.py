"""
CyberQuant AI — Main FastAPI Application
AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, async_session_maker
from app.seed import seed_database

# Import routers
from app.api.dashboard import router as dashboard_router
from app.api.assets import router as assets_router
from app.api.optimization import router as optimization_router
from app.api.simulation import router as simulation_router
from app.api.compliance import router as compliance_router
from app.api.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle — initialize DB and seed data on startup."""
    print("[*] Starting CyberQuant AI...")
    
    # Initialize database tables
    await init_db()
    print("[+] Database tables created")
    
    # Seed synthetic data
    async with async_session_maker() as session:
        await seed_database(session)
    
    # Train ML model
    try:
        from app.engines.ml_predict import ml_engine
        result = ml_engine.train()
        print(f"[+] ML Model trained: {result}")
    except Exception as e:
        print(f"[!] ML Model training skipped: {e}")
    
    print("[+] CyberQuant AI is ready!")
    yield
    print("[-] Shutting down CyberQuant AI...")


app = FastAPI(
    title="CyberQuant AI",
    description="AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard_router)
app.include_router(assets_router)
app.include_router(optimization_router)
app.include_router(simulation_router)
app.include_router(compliance_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    return {
        "name": "CyberQuant AI",
        "version": settings.APP_VERSION,
        "status": "operational",
        "description": "AI-Powered Continuous Cyber Risk Quantification & Investment Optimization",
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": settings.APP_VERSION}
