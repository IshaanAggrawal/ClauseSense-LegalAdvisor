from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Advisor AI"
    API_V1_STR: str = "/api/v1"
    
    # Required Keys
    GOOGLE_API_KEY: str  
    GROQ_API_KEY: str
    PINECONE_API_KEY: str 
    
    # Optional (Keep if you use Supabase elsewhere, otherwise remove)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Limits
    RATE_LIMIT: str = "5/minute"
    DAILY_QUOTA: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()