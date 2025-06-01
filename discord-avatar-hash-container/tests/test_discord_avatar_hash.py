from dotenv import load_dotenv
import requests
import hashlib
import hmac
import base64
import time
import os

load_dotenv()
SHARED_SECRET_B64 = os.getenv("SHARED_SECRET")
if not SHARED_SECRET_B64:
    raise RuntimeError("SHARED_SECRET not set")
SHARED_SECRET = base64.b64decode(SHARED_SECRET_B64)

method = "POST"
url = "http://localhost:8000/discord/avatar/hash"
path = "/discord/avatar/hash"
timestamp = str(int(time.time()))

message = f"{method}:{path}:{timestamp}"
signature = hmac.new(SHARED_SECRET, message.encode(), hashlib.sha256).hexdigest()
headers = {
    "X-Timestamp": timestamp,
    "X-Signature": signature
}

json = {
    "discordId": '650814947437182977'
}

response = requests.post(url, json=json, headers=headers)

print(f"Status code: {response.status_code}")
print(response.json())