from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://cyberquant:cyberquant_secure_2026@localhost:5432/cyberquant_db"
    
    # Security
    SECRET_KEY: str = "cyberquant-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'
    
    # App
    APP_NAME: str = "CyberQuant AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Monte Carlo
    MONTE_CARLO_SIMULATIONS: int = 10000
    
    # LLM (optional)
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
