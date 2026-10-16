import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    COMPANY_NAME: str = os.getenv("COMPANY_NAME", "OLE Oceanwide Logistics Europe GmbH")
    PARTNER_NAME: str = os.getenv("PARTNER_NAME", "Oceanwide Logistics Global Network (OLGN)")
    GATEWAY_NAME: str = os.getenv("GATEWAY_NAME", "Oceanwide Gateway")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./oceanwide_gateway.db")
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
