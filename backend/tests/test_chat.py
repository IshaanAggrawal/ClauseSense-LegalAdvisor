import requests
import json

# --- CONFIG ---
BASE_URL = "http://127.0.0.1:8000/api/v1/chat"

def run_chat():
    # We ask about the specific fact in the dummy file ($1,000,000)
    payload = {
        "session_id": "test_session_1",
        "message": "What is the specific penalty amount mentioned in the agreement?"
    }
    
    headers = {"Content-Type": "application/json"}
    
    print(f"🗣️  Asking: '{payload['message']}'...")
    
    try:
        response = requests.post(BASE_URL, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            ans = data.get("response", "")
            
            print("\n✅ CHAT SUCCESS!")
            print(f"🤖 AI Answer: {ans}")
            
            # Verification Logic
            if "1,000,000" in ans or "million" in ans.lower():
                print("\n🎉 VERIFIED: The AI read your uploaded file correctly!")
            else:
                print("\n⚠️  NOTE: The AI gave a generic answer. Check your Vector DB logic.")
                
        else:
            print(f"❌ CHAT FAILED: {response.status_code}")
            print(f"   Details: {response.text}")

    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    run_chat()