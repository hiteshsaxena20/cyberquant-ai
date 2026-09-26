"""
CyberQuant AI — Local Development Runner
Runs the backend with SQLite instead of PostgreSQL for quick local development.
No Docker required. Just: python run_local.py
"""
import os
import sys
import subprocess

# Override DATABASE_URL to use SQLite (aiosqlite)
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./cyberquant.db"
os.environ["DEBUG"] = "False"
os.environ["CORS_ORIGINS"] = '["http://localhost:5173","http://localhost:3000","http://127.0.0.1:5173"]'

def main():
    print("=" * 60)
    print("  CyberQuant AI — Local Development Server")
    print("  Using SQLite for local development")
    print("=" * 60)
    print()
    
    # Check dependencies
    try:
        import fastapi
        import sqlalchemy
        import numpy
    except ImportError:
        print("Installing Python dependencies...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "fastapi", "uvicorn[standard]", "sqlalchemy", "aiosqlite",
            "numpy", "pandas", "scikit-learn", "xgboost",
            "pydantic", "pydantic-settings", "python-multipart",
            "passlib[bcrypt]", "bcrypt", "python-jose[cryptography]",
            "scipy", "httpx",
        ])
        print("Dependencies installed!\n")
    
    # Try installing SHAP (optional, may fail on some systems)
    try:
        import shap
    except ImportError:
        print("Note: SHAP not installed. Explainability will use fallback feature importance.")
        print("  To install: pip install shap\n")
    
    # Try installing OR-Tools (optional)
    try:
        from ortools.linear_solver import pywraplp
    except ImportError:
        print("Note: OR-Tools not installed. Optimization will use greedy algorithm.")
        print("  To install: pip install ortools\n")
    
    print("Starting server at http://localhost:8000")
    print("API docs at http://localhost:8000/docs")
    print()
    
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )

if __name__ == "__main__":
    main()
