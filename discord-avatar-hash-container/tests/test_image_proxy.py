from dotenv import load_dotenv
import requests
import hashlib
import hmac
import base64
import time
import os
from urllib.parse import quote

load_dotenv()
SHARED_SECRET_B64 = os.getenv("SHARED_SECRET")
if not SHARED_SECRET_B64:
    raise RuntimeError("SHARED_SECRET not set")
SHARED_SECRET = base64.b64decode(SHARED_SECRET_B64)

method = "GET"
raw_image_url = "https://game-assets.swgoh.gg/textures/tex.charui_luke_jml.png"
encoded_image_url = quote(raw_image_url, safe="")
path = "/image/proxy"
url = f"http://localhost:8080{path}?url={encoded_image_url}"

timestamp = str(int(time.time()))
message = f"{method}:{path}:{timestamp}"
signature = hmac.new(SHARED_SECRET, message.encode(), hashlib.sha256).hexdigest()

headers = {
    "X-Timestamp": timestamp,
    "X-Signature": signature
}

response = requests.get(url, headers=headers)

print(f"Status: {response.status_code}")
content_type = response.headers.get("Content-Type")
cors = response.headers.get("Access-Control-Allow-Origin")
print(f"Content-Type: {content_type}")
print(f"Access-Control-Allow-Origin: {cors}")