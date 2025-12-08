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
        # Get today's date in UTC (Supabase uses UTC by default)
        today_start = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        try:
            # Count how many messages this session sent *today*
            # We filter by 'created_at' being greater than or equal to today 00:00
            res = self.supabase.table('chat_history')\
                .select('*', count='exact')\
                .eq('session_id', session_id)\
                .gte('created_at', today_start)\
                .execute()
            
            # If the count is LESS than the limit, they are good to go.
            return res.count < settings.DAILY_QUOTA
            
        except Exception as e:
            print(f"Quota Check Error: {e}")
            # If DB fails, we default to True (Allow access) so we don't block users due to a bug
            return True

    def get_history(self, session_id: str):
        """Fetch last 5 messages for context"""
        try:
            res = self.supabase.table('chat_history')\
                .select('*')\
                .eq('session_id', session_id)\
                .order('created_at', desc=True)\
                .limit(5)\
                .execute()
            return res.data[::-1] if res.data else []
        except Exception:
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