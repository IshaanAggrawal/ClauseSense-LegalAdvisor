from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Advisor AI"
    API_V1_STR: str = "/api/v1"
    
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    HF_INFERENCE_URL: str
    HF_API_KEY: str
    
    OLLAMA_BASE_URL: str
    OLLAMA_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()