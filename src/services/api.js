/**
 * DEXTRA API Service Client
 * Features instant non-blocking AbortControllers to prevent browser buffering
 * when the FastAPI server is offline.
 */

const API_BASE_URL = 'http://localhost:8000/api';
const TIMEOUT_MS = 600; // 600ms ultra-fast timeout before instant offline fallback

export const apiService = {
  // Health check
  async checkHealth() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return { status: 'offline', mode: 'Local Demo Mode' };
    }
  },

  // Device Telemetry Heartbeat
  async getDeviceStatus() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/device`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return {
        status: 'CONNECTED',
        device_id: 'ESP32-DEXTRA-01',
        wifi_status: 'Connected (Mesh)',
        servo1_angle: 90,
        servo2_angle: 90,
        button_state: 'RELEASED',
        last_sync: 'Just now',
        mode: 'Simulator Mode'
      };
    }
  },

  // Ingest telemetry event
  async ingestEvent(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return { status: 'success', mode: 'local' };
    }
  },

  // User sessions
  async getSessions(userId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/sessions?user_id=${userId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  },

  async recordSession(sessionData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return { status: 'success', mode: 'local' };
    }
  },

  // User calibration settings
  async getCalibration(userId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/calibration?user_id=${userId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/calibration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calibrationData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return { status: 'success', mode: 'local' };
    }
  }
};
