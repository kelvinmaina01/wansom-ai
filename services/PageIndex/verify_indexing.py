import requests
import time
import json

BASE_URL = "http://localhost:8000"
DOC_ID = "a1b63a06-7ade-4ab8-a41f-ee1140f36af7"
# Constructing URL based on Supabase standard patterns
FILE_URL = "https://ygtnjiwdrfldpsmakaqo.supabase.co/storage/v1/object/public/raw-documents/1773620741600-dsgj1r.pdf"

def trigger_index():
    print(f"Triggering index for {DOC_ID}...")
    response = requests.post(f"{BASE_URL}/index", json={
        "file_url": FILE_URL,
        "document_id": DOC_ID,
        "model": "gemini-1.5-flash" # Using flash for faster indexing test
    })
    print("Response:", response.json())
    return response.json()

def check_status():
    while True:
        response = requests.get(f"{BASE_URL}/status/{DOC_ID}")
        status_data = response.json()
        print(f"Current Status: {status_data['status']}")
        if status_data['status'] in ['completed', 'error']:
            break
        if "error" in status_data['status']:
            break
        time.sleep(5)
    return status_data

if __name__ == "__main__":
    trigger_index()
    check_status()
