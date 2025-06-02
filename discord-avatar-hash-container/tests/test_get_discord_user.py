from dotenv import load_dotenv
import requests
import os

load_dotenv()
BOT_TOKEN = os.getenv('BOT_TOKEN')

url = 'https://discord.com/api/v10/users/650814947437182977'
headers = {
    "Authorization": f"Bot {BOT_TOKEN}"
}

response = requests.get(url, headers=headers)

print(response.status_code)
if response.status_code == 200:
    print(response.json())
else:
    print(response.text)