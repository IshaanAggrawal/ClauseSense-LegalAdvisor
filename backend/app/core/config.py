from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Advisor AI"
    API_V1_STR: str = "/api/v1"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GOOGLE_API_KEY: str  
    GROQ_API_KEY: str  
    HF_INFERENCE_URL: str
    HF_API_KEY: str
    RATE_LIMIT: str = "5/minute"
    DAILY_QUOTA: int = 50
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()