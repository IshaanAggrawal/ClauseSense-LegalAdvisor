from supabase import create_client, Client
from app.core.config import settings

class SessionManager:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    def get_history(self, session_id: str):
        res = self.supabase.table('chat_history').select('*').eq('session_id', session_id).order('created_at', desc=True).limit(5).execute()
        return res.data[::-1] if res.data else []

    def save_turn(self, session_id: str, user_msg: str, ai_msg: str):
        self.supabase.table('chat_history').insert({"session_id": session_id, "user_message": user_msg, "ai_response": ai_msg}).execute()