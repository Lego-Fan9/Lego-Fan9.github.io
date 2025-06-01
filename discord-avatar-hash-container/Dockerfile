FROM python:3.12-slim

WORKDIR /app

#COPY pip.txt .

RUN pip install --no-cache-dir fastapi slowapi pydantic python-dotenv requests

COPY main.py .

EXPOSE 8080

CMD ["python", "main.py"]