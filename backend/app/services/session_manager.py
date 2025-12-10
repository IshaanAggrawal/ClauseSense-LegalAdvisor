from supabase import create_client, Client
from app.core.config import settings
from datetime import datetime, timezone

class SessionManager:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    def register_document(self, doc_id: str, filename: str, file_size: int, content: str = ""):
        try:
            self.supabase.table('documents').insert({
                "id": doc_id,
                "filename": filename,
                "size_bytes": file_size,
                "content": content
            }).execute()
        except Exception as e:
            print(f"⚠️ Doc Register Error: {e}")

    # 🔴 UPDATED: Robust Fetching
    def get_document_data(self, doc_id: str):
        try:
            # Strip whitespace just in case
            clean_id = doc_id.strip()
            res = self.supabase.table('documents').select('filename, content').eq('id', clean_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
            else:
                print(f"⚠️ Document not found in DB: {clean_id}")
                return None
        except Exception as e:
            print(f"❌ Fetch Doc Error: {e}")
            return None

    def get_document_content(self, doc_id: str):
        data = self.get_document_data(doc_id)
        return data['content'] if data else ""

    def _ensure_session(self, session_id: str, doc_id: str = None):
        try:
            # Safe split for primary ID
            primary_doc_id = doc_id
            if doc_id and "," in doc_id:
                primary_doc_id = doc_id.split(",")[0].strip()

            res = self.supabase.table('sessions').select('*').eq('id', session_id).execute()
            
            if not res.data:
                data = {"id": session_id}
                if primary_doc_id and primary_doc_id not in ["general", "general_chat"]:
                    data["document_id"] = primary_doc_id
                self.supabase.table('sessions').insert(data).execute()
            else:
                existing_doc = res.data[0].get('document_id')
                if primary_doc_id and primary_doc_id not in ["general", "general_chat"] and existing_doc != primary_doc_id:
                    self.supabase.table('sessions').update({"document_id": primary_doc_id}).eq('id', session_id).execute()
        except Exception as e:
            print(f"Session Error: {e}")

    def get_history(self, session_id: str):
        try:
            res = self.supabase.table('messages').select('role, content').eq('session_id', session_id).order('created_at', desc=True).limit(6).execute()
            return res.data[::-1] if res.data else []
        except: return []

    def save_turn(self, session_id: str, doc_id: str, user_msg: str, ai_msg: str):
        try:
            self._ensure_session(session_id, doc_id)
            self.supabase.table('messages').insert([
                {"session_id": session_id, "role": "user", "content": user_msg},
                {"session_id": session_id, "role": "assistant", "content": ai_msg}
            ]).execute()
        except Exception as e:
            print(f"Save Turn Error: {e}")