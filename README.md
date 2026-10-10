# DEXTRA — Smart Wrist-Hand Orthosis Digital Platform

DEXTRA is an IoT-assisted rehabilitation and assistive-technology platform designed to support controlled wrist and hand exercises for stroke survivors and motor rehabilitation patients.

---

## 🦾 System Architecture

```
User / Patient
     ↓
DEXTRA Web Application (React + Vite)
     ↓
FastAPI Backend (Python)
     ↓
Wi-Fi Telemetry (HTTP POST /api/ingest)
     ↓
ESP32 Development Board
     ↓
2 × MG90S Servo Motors & 2 × Push Buttons
     ↓
Wrist-Hand Orthosis Brace
```

---

## ✨ Key Features

- **Personalized Patient Dashboard**: Live device connectivity status, today's repetitions count, successful reps, success rate %, and session duration.
- **Interactive 3D Hand/Orthosis Visualizer**: Three.js WebGL canvas displaying real-time wrist flexion and extension movement during exercise sessions.
- **Dedicated Device Monitor & Simulator**: Real-time ESP32 heartbeat monitoring, hardware flow diagram, and built-in test-bench simulator for hardware-free demonstrations.
- **User-Specific Device Calibration**: Custom servo angle min/max boundary configuration tailored to individual patient range-of-motion.
- **Full Multilingual Support**: 100% translated interface in English, Telugu (తెలుగు), and Hindi (हिन्दी) with persistent state.
- **Role-Based Access Control (RBAC)**: Personalized portals for Patients, Caregivers, Physiotherapists, and Administrators.
- **Data-Driven Achievements & History**: Complete session logging with filtering, sorting, and verified achievement milestone unlocking.

---

## 🚀 How to Run the Project

### 1. Frontend Web Application (React + Vite)

```bash
# Navigate to project directory
cd dextra

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 2. FastAPI Backend Service

```bash
# Navigate to backend directory
cd dextra/backend

# Install python dependencies
pip install -r requirements.txt

# Launch FastAPI server
python main.py
```

The API server will run at `http://localhost:8000`. Test endpoint health at `http://localhost:8000/api/health`.

---

### 3. ESP32 Microcontroller Firmware

1. Open `dextra/esp32/dextra_esp32_firmware.ino` in the Arduino IDE.
2. Update the Wi-Fi credentials:
   ```cpp
   const char* ssid     = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* apiIngestEndpoint = "http://YOUR_SERVER_IP:8000/api/ingest";
   ```
3. Connect your ESP32 board and flash the sketch.
4. Pin Connections:
   - Servo 1 (Wrist): GPIO Pin 18 (PWM)
   - Servo 2 (Fingers): GPIO Pin 19 (PWM)
   - Start/Pause Button: GPIO Pin 4 (Pull-Up)
   - Rep Count Button: GPIO Pin 5 (Pull-Up)

---

## 🧪 Demo Accounts (1-Click Test Login)

- **Patient**: `lakshmi@dextra.org`
- **Caregiver**: `ramesh@dextra.org`
- **Physiotherapist**: `ananya@dextra.org`
- **Administrator**: `admin@dextra.org`

---

## 📜 Project Structure

```
dextra/
├── backend/
│   ├── main.py                # FastAPI IoT Ingestion & DB API
│   └── requirements.txt       # Python dependencies
├── esp32/
│   └── dextra_esp32_firmware.ino # ESP32 Arduino C++ Firmware
├── src/
│   ├── components/
│   │   ├── HandOrthosis3D.jsx # Three.js 3D Orthosis Visualizer
│   │   ├── HardwareSimulator.jsx # Hardware Prototype Simulator
│   │   ├── DeviceCalibration.jsx # User Servo Angle Range Calibration
│   │   ├── LandingPage.jsx    # Hero & Product Showcase
│   │   └── Layout.jsx         # Application Shell & Navigation
│   ├── pages/                 # Role & Feature Page Views
│   ├── services/
│   │   └── api.js             # Unified FastAPI Client
│   └── translations/          # i18n Strings (en.js, te.js, hi.js)
```
