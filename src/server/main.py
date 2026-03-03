from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os

from contextlib import asynccontextmanager

# Database Setup
DB_FILE = "stats.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS global_stats 
                 (id INTEGER PRIMARY KEY, tokens INTEGER, chunks INTEGER, runs INTEGER)''')
    # Init row if empty
    c.execute("SELECT * FROM global_stats WHERE id=1")
    if not c.fetchone():
        c.execute("INSERT INTO global_stats (id, tokens, chunks, runs) VALUES (1, 0, 0, 0)")
    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for Docker/Tunnel flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatsUpdate(BaseModel):
    tokens: int
    chunks: int
    runs: int

@app.get("/stats")
def get_stats():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT tokens, chunks, runs FROM global_stats WHERE id=1")
    data = c.fetchone()
    conn.close()
    if data:
        return {"tokens": data[0], "chunks": data[1], "runs": data[2]}
    return {"tokens": 0, "chunks": 0, "runs": 0}

@app.post("/stats/increment")
def increment_stats(update: StatsUpdate):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("""
        UPDATE global_stats 
        SET tokens = tokens + ?, chunks = chunks + ?, runs = runs + ? 
        WHERE id = 1
    """, (update.tokens, update.chunks, update.runs))
    conn.commit()
    
    # Return new stats
    c.execute("SELECT tokens, chunks, runs FROM global_stats WHERE id=1")
    data = c.fetchone()
    conn.close()
    
    return {"tokens": data[0], "chunks": data[1], "runs": data[2]}

class CookRequest(BaseModel):
    text: str
    chunk_size: int = 28000

@app.post("/cook")
async def cook_text(request: CookRequest):
    # Basic wrapper around the core chunker logic
    # TODO: Refactor 'serving_lines' to be more API friendly if needed, 
    # but for now we just want to prove the python logic is accessible.
    # Since serving_lines writes to disk, we might want a memory-only version later.
    # For this portfolio clean-up, simply exposing the endpoint and validating import is enough.
    
    # Import here to avoid circular dep if any, though likely safe at top
    from src.server.core.chunker import count_tokens # Assuming this exists or similar
    
    tokens = len(request.text) # Quick approx or real use tiktoken if available
    return {"message": "Python Cooker Ready", "input_length": len(request.text)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
