# Stage 1: Build the React UI
FROM node:20-alpine as ui-build
WORKDIR /app/ui
COPY src/ui/package.json src/ui/package-lock.json* ./
RUN npm install
COPY src/ui .
RUN npm run build

# Stage 2: Python FastAPI Backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application Code
COPY src/ ./src/

# Copy Built UI from Stage 1 to /app/static
COPY --from=ui-build /app/ui/dist /app/static

# Expose Port
EXPOSE 8000

# Run
CMD ["uvicorn", "src.server.main:app", "--host", "0.0.0.0", "--port", "8000"]
