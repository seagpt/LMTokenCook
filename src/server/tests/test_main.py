from fastapi.testclient import TestClient
from src.server.main import app, init_db

# Ensure DB is created before tests run
init_db()

client = TestClient(app)

def test_read_stats():
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert "runs" in data

def test_cook_endpoint():
    response = client.post("/cook", json={"text": "Hello world", "chunk_size": 100})
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Python Cooker Ready"
    assert data["input_length"] == 11
