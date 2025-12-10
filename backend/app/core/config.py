from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Advisor AI"
    API_V1_STR: str = "/api/v1"
    
    GROQ_API_KEY: str  # Mandatory for LLM inference
    SUPABASE_URL: str  # Mandatory for Document/History storage
    SUPABASE_KEY: str  # Mandatory for Supabase client access

    # This should be read from an environment variable for deployment safety
    # Example: "http://localhost:3000,https://clause-sense-legal-advisor.vercel.app"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # --- REMOVED/OPTIONAL KEYS ---
    # GOOGLE_API_KEY: str # Not needed if you are not using Gemini Embeddings
    # PINECONE_API_KEY: str # Not needed if you are not using Pinecone DB

    RATE_LIMIT: str = "5/minute"
    DAILY_QUOTA: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore" 

settings = Settings()