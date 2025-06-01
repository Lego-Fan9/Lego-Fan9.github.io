from fastapi import FastAPI, Request, HTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import hashlib
import base64
import hmac
import time
import os

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN not set")
SHARED_SECRET_B64 = os.getenv("SHARED_SECRET")
if not SHARED_SECRET_B64:
    raise RuntimeError("SHARED_SECRET not set")
SHARED_SECRET = base64.b64decode(SHARED_SECRET_B64)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

def verify_hmac(method: str, path: str, timestamp: str, signature: str) -> bool:
    try:
        ts = int(timestamp)
        now = int(time.time())
        if abs(now - ts) > 10:
            return False
    except ValueError:
        return False
    
    string_to_sign = f"{method}:{path}:{timestamp}"
    computed = hmac.new(SHARED_SECRET, string_to_sign.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, signature)

@app.get("/")
@limiter.limit("20/minute")
async def is_up(request: Request):
    return {"status": "up"}

@app.get("/hmac")
@limiter.limit("1/minute")
async def test_hmac(request: Request):
    ts = request.headers.get("X-Timestamp")
    sig = request.headers.get("X-Signature")
    if not ts or not sig or not verify_hmac("GET", request.url.path, ts, sig):
        raise HTTPException(status_code=401, detail="Invalid or missing signature and or timestamp")
    
    return {"message": "hmac good"}

class discordAvatarHash(BaseModel):
    discordId: str

@app.post("/discord/avatar/hash")
@limiter.limit("15/minute")
async def get_avatar_hash(payload: discordAvatarHash, request: Request):
    ts = request.headers.get("X-Timestamp")
    sig = request.headers.get("X-Signature")
    if not ts or not sig or not verify_hmac("POST", request.url.path, ts, sig):
        raise HTTPException(status_code=401, detail="Invalid or missing signature and or timestamp")
    
    url = f"https://discord.com/api/v10/users/{payload.discordId}"
    headers = {
        "Authorization": f"Bot {BOT_TOKEN}"
    }
    try:
        response = requests.get(url, headers=headers)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"An error occured")
    if response.status_code != 200:
        print(f'Bad response::Status Code:"{response.status_code}"::Body:{response.content}')
        raise HTTPException(status_code=500, detail="An error occured")
    response_data = response.json()
    return {
        "discordId": payload.discordId,
        "avatarHash": response_data['avatar']
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)