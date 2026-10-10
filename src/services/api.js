/**
 * DEXTRA API Service Client
 * Handles communication with the FastAPI backend (/api/*)
 * and falls back gracefully to local state / mock storage if offline.
 */

const API_BASE_URL = 'http://localhost:8000/api';

export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      if (res.ok) return await res.json();
    } catch {
      return { status: 'offline', mode: 'Local Demo Mode' };
    }
  },

  // Device Telemetry Heartbeat
  async getDeviceStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/device`);
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
      return {
        status: 'CONNECTED',
        device_id: 'ESP32-DEXTRA-01',
        wifi_status: 'Connected (Mesh)',
        servo1_status: 'Ready',
        servo2_status: 'Ready',
        button_status: 'Ready',
        last_sync: 'Just now',
        mode: 'Simulator Mode'
      };
    }
  },

  // Ingest telemetry event
  async ingestEvent(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch {
      return { status: 'success', mode: 'local' };
    }
  },

  // User sessions
  async getSessions(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch {
      return null;
    }
  },

  async recordSession(sessionData) {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (res.ok) return await res.json();
    } catch {
      return { status: 'success', mode: 'local' };
    }
  },

  // User calibration settings
  async getCalibration(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/calibration?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch {
      return {
        user_id: userId,
        servo1_neutral: 90,
        servo1_min: 15,
        servo1_max: 165,
        servo2_neutral: 90,
        servo2_min: 15,
        servo2_max: 165,
        intensity: 'MODERATE'
      };
    }
  },

  async saveCalibration(calibrationData) {
    try {
      const res = await fetch(`${API_BASE_URL}/calibration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calibrationData)
      });
      if (res.ok) return await res.json();
    } catch {
      return { status: 'success', mode: 'local' };
    }
  }
};
