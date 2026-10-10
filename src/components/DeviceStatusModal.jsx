import React from 'react';

export default function DeviceStatusModal({ device, onClose }) {
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="modal-title-group">
            <div className="device-icon-large">🦾</div>
            <div>
              <h3>Dextra Hardware Diagnostics & Telemetry</h3>
              <p>Real-time status of wrist-hand orthosis actuators and IMU sensors</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="device-status-grid">
          <div className="status-box">
            <span className="box-label">Connection Status</span>
            <div className="box-val text-emerald">
              <span className="status-dot online"></span> Connected (BLE 5.2)
            </div>
            <span className="box-sub">Signal: {device.signalStrength}</span>
          </div>

          <div className="status-box">
            <span className="box-label">Battery Level</span>
            <div className="box-val text-teal">
              ⚡ {device.battery}% Charged
            </div>
            <span className="box-sub">Approx. 6.5 hours active runtime left</span>
          </div>

          <div className="status-box">
            <span className="box-label">Actuator Motors</span>
            <div className="box-val text-cyan">
              Optimal (0.8 Nm Torque)
            </div>
            <span className="box-sub">Dual NEMA Servo Actuators Calibrated</span>
          </div>

          <div className="status-box">
            <span className="box-label">Angle Feedback Sensor</span>
            <div className="box-val text-purple">
              IMU 6-Axis Active
            </div>
            <span className="box-sub">Resolution: ±0.5 degrees precision</span>
          </div>
        </div>

        <div className="diagnostic-logs">
          <h4>Hardware Calibration Log</h4>
          <div className="log-console">
            <div>[08:30:01] ⚡ Power-on self-test passed (Firmware v2.1.4)</div>
            <div>[08:30:02] 📡 Bluetooth LE connected to host web app</div>
            <div>[08:30:04] 📐 Zero-position angle calibrated: 0.00° wrist flex</div>
            <div>[08:30:05] ⚙️ Servo motor torque safety cutoff set to 1.2 Nm</div>
            <div>[08:30:06] ✅ Ready for rehabilitation exercise protocols</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary full-width" onClick={onClose}>
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
