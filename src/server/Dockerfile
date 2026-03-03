# /src/server/Dockerfile

# 1. Base Image (Slim for security/size)
FROM python:3.11-slim

# 2. Set Env Config
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Work Directory
WORKDIR /app

# 4. Install Dependencies
# Copy requirements from the src/server context
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy Application Code
COPY . .

# 6. Security: Create Non-Root User
# Create a user with UID 1000 to avoid root privileges
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# 7. Expose Port (Internal Docker Network)
EXPOSE 8000

# 8. Run Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
