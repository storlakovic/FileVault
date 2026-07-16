FROM python:3.12-slim

WORKDIR /app

RUN pip install fastapi uvicorn

COPY app/ .

EXPOSE 8000

CMD ["python3", "main.py"]
