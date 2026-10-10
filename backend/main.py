"""
DEXTRA — Smart Wrist-Hand Orthosis FastAPI Backend
==================================================
Serves IoT ingestion endpoints, telemetry heartbeats, session logging, user auth,
and calibration settings for the Dextra rehabilitation platform.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import hashlib
import sqlite3
import os

app = FastAPI(title="DEXTRA IoT Rehabilitation API", version="1.0.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Initialization
DB_PATH = os.path.join(os.path.dirname(__file__), "dextra.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        total_reps INTEGER DEFAULT 0,
        successful_reps INTEGER DEFAULT 0,
        target_reps INTEGER DEFAULT 10,
        duration_seconds INTEGER DEFAULT 0,
        success_rate REAL DEFAULT 0.0,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Device Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS device_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        status TEXT NOT NULL,
        servo1_angle INTEGER DEFAULT 0,
        servo2_angle INTEGER DEFAULT 0,
        button_state TEXT DEFAULT 'RELEASED',
        event_type TEXT DEFAULT 'HEARTBEAT',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Calibration Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS calibration (
        user_id TEXT PRIMARY KEY,
        servo1_neutral INTEGER DEFAULT 90,
        servo1_min INTEGER DEFAULT 10,
        servo1_max INTEGER DEFAULT 170,
        servo2_neutral INTEGER DEFAULT 90,
        servo2_min INTEGER DEFAULT 10,
        servo2_max INTEGER DEFAULT 170,
        intensity TEXT DEFAULT 'MODERATE',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Insert Demo Users if database is newly initialized
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        demo_users = [
            ("usr-patient", "Lakshmi Devi", "lakshmi@dextra.org", hashlib.sha256("password123".encode()).hexdigest(), "patient"),
            ("usr-caregiver", "Ramesh", "ramesh@dextra.org", hashlib.sha256("password123".encode()).hexdigest(), "caregiver"),
            ("usr-physio", "Dr. Ananya Rao", "ananya@dextra.org", hashlib.sha256("password123".encode()).hexdigest(), "physiotherapist"),
            ("usr-admin", "Demo Admin", "admin@dextra.org", hashlib.sha256("password123".encode()).hexdigest(), "administrator"),
        ]
        cursor.executemany("INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)", demo_users)
    
    conn.commit()
    conn.close()

init_db()

# Pydantic Schemas
class IngestPayload(BaseModel):
    device_id: str = "ESP32-DEXTRA-01"
    event_type: str  # "BUTTON_PRESS", "SERVO_SWEEP", "HEARTBEAT", "REP_COMPLETE"
    servo1_angle: Optional[int] = 0
    servo2_angle: Optional[int] = 0
    button_state: Optional[str] = "RELEASED"
    user_id: Optional[str] = "usr-patient"

class SessionCreate(BaseModel):
    user_id: str
    exercise_id: str
    exercise_name: str
    total_reps: int
    successful_reps: int
    target_reps: int
    duration_seconds: int

class LoginRequest(BaseModel):
    email: str
    password: str

class CalibrationPayload(BaseModel):
    user_id: str
    servo1_neutral: int
    servo1_min: int
    servo1_max: int
    servo2_neutral: int
    servo2_min: int
    servo2_max: int
    intensity: str

# API Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "DEXTRA IoT Backend", "timestamp": datetime.datetime.now().isoformat()}

@app.post("/api/ingest")
def ingest_telemetry(payload: IngestPayload):
    """Primary hardware ingestion route for ESP32 and Device Simulator"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO device_telemetry (device_id, status, servo1_angle, servo2_angle, button_state, event_type) VALUES (?, ?, ?, ?, ?, ?)",
        (payload.device_id, "CONNECTED", payload.servo1_angle, payload.servo2_angle, payload.button_state, payload.event_type)
    )
    conn.commit()
    conn.close()
    return {"status": "success", "event_received": payload.event_type, "timestamp": datetime.datetime.now().isoformat()}

@app.get("/api/device")
def get_device_status():
    """Retrieve current ESP32 device connectivity & telemetry heartbeat"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM device_telemetry ORDER BY timestamp DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return {
            "status": "CONNECTED",
            "device_id": "ESP32-DEXTRA-01",
            "wifi_status": "Connected (Dextra_Mesh)",
            "servo1_status": "Ready",
            "servo2_status": "Ready",
            "button_status": "Ready",
            "last_sync": "Just now",
            "mode": "Interactive Hardware Mode"
        }
    
    return {
        "status": row["status"],
        "device_id": row["device_id"],
        "wifi_status": "Connected",
        "servo1_angle": row["servo1_angle"],
        "servo2_angle": row["servo2_angle"],
        "button_state": row["button_state"],
        "last_event": row["event_type"],
        "last_sync": row["timestamp"]
    }

@app.get("/api/sessions")
def get_user_sessions(user_id: str = "usr-patient"):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions WHERE user_id = ? ORDER BY completed_at DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/sessions")
def record_session(session: SessionCreate):
    conn = get_db()
    cursor = conn.cursor()
    sess_id = f"sess-{int(datetime.datetime.now().timestamp() * 1000)}"
    success_rate = round((session.successful_reps / session.total_reps * 100), 1) if session.total_reps > 0 else 0.0
    
    cursor.execute(
        """INSERT INTO sessions 
        (id, user_id, exercise_id, exercise_name, total_reps, successful_reps, target_reps, duration_seconds, success_rate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (sess_id, session.user_id, session.exercise_id, session.exercise_name, session.total_reps, session.successful_reps, session.target_reps, session.duration_seconds, success_rate)
    )
    conn.commit()
    conn.close()
    return {"status": "success", "session_id": sess_id}

@app.get("/api/progress")
def get_user_progress(user_id: str = "usr-patient"):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total_sessions, SUM(total_reps) as total_reps, SUM(successful_reps) as successful_reps, SUM(duration_seconds) as total_duration FROM sessions WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    total_reps = row["total_reps"] or 0
    successful_reps = row["successful_reps"] or 0
    rate = round((successful_reps / total_reps * 100), 1) if total_reps > 0 else 0.0
    
    return {
        "user_id": user_id,
        "total_sessions": row["total_sessions"] or 0,
        "total_reps": total_reps,
        "successful_reps": successful_reps,
        "success_rate": rate,
        "total_duration_minutes": round((row["total_duration"] or 0) / 60, 1)
    }

@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    pwd_hash = hashlib.sha256(req.password.encode()).hexdigest()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password_hash = ?", (req.email, pwd_hash))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "status": "success",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@app.get("/api/calibration")
def get_calibration(user_id: str = "usr-patient"):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM calibration WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return {
            "user_id": user_id,
            "servo1_neutral": 90,
            "servo1_min": 15,
            "servo1_max": 165,
            "servo2_neutral": 90,
            "servo2_min": 15,
            "servo2_max": 165,
            "intensity": "MODERATE"
        }
    return dict(row)

@app.post("/api/calibration")
def save_calibration(cal: CalibrationPayload):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO calibration 
    (user_id, servo1_neutral, servo1_min, servo1_max, servo2_neutral, servo2_min, servo2_max, intensity, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (cal.user_id, cal.servo1_neutral, cal.servo1_min, cal.servo1_max, cal.servo2_neutral, cal.servo2_min, cal.servo2_max, cal.intensity))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Calibration profile updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
