from supabase import create_client, Client
from app.core.config import settings
from datetime import datetime, timezone

class SessionManager:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    def check_quota(self, session_id: str) -> bool:
        """
        Checks if the user has exceeded their daily message limit.
        Returns True if they have credits left.
        """
        today_start = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        try:
            res = self.supabase.table('chat_history')\
                .select('*', count='exact')\
                .eq('session_id', session_id)\
                .gte('created_at', today_start)\
                .execute()
            
            return res.count < settings.DAILY_QUOTA
            
        except Exception as e:
            print(f"Quota Check Error: {e}")
            return True

    def get_history(self, session_id: str):
        """Fetch last 5 messages for context"""
        try:
            # Fetch last 5 messages
            res = self.supabase.table('chat_history')\
                .select('*')\
                .eq('session_id', session_id)\
                .order('created_at', desc=True)\
                .limit(5)\
                .execute()
            
            # Reverse them to be in chronological order (Oldest -> Newest)
            return res.data[::-1] if res.data else []
        except Exception as e:
            print(f"History Fetch Error: {e}")
            return []

    def save_turn(self, session_id: str, user_msg: str, ai_msg: str):
        """Save the conversation to DB"""
        try:
            self.supabase.table('chat_history').insert({
                "session_id": session_id, 
                "user_message": user_msg, 
                "ai_response": ai_msg
            }).execute()
        except Exception as e:
            print(f"Save History Error: {e}")