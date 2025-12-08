import requests
import os

# --- CONFIG ---
BASE_URL = "http://127.0.0.1:8000/api/v1/upload"
FILENAME = "dummy_contract.txt"

# Unique content to prove the AI is reading THIS file
CONTENT = """
AGREEMENT TERMS:
1. The project code name is "Project Blue Sky".
2. The penalty for late delivery is exactly $1,000,000 USD.
3. The deadline is December 31st, 2025.
"""

def run_upload():
    # 1. Create the dummy file
    with open(FILENAME, "w") as f:
        f.write(CONTENT)
    print(f"📄 Created temporary file: {FILENAME}")

    # 2. Upload it
    try:
        with open(FILENAME, "rb") as f:
            files = {"file": (FILENAME, f, "text/plain")}
            print("📤 Uploading...")
            response = requests.post(BASE_URL, files=files)

        if response.status_code == 200:
            print("✅ UPLOAD SUCCESS!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ UPLOAD FAILED: {response.status_code}")
            print(f"   Details: {response.text}")

    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # 3. Cleanup (optional, remove if you want to keep the file)
    # os.remove(FILENAME) 

if __name__ == "__main__":
    run_upload()