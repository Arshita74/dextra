import React, { useState } from 'react';

export default function ClinicianDashboard({ clinician, patients, sessionsHistory, onUpdatePatientGoal, t }) {
  const clinicianPatients = patients.filter((p) => p.therapistId === clinician.id || clinician.assignedPatientIds?.includes(p.id)) || patients;
  const [selectedPatientId, setSelectedPatientId] = useState(clinicianPatients[0]?.id || patients[0]?.id);
  const [newTargetAngle, setNewTargetAngle] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientSessions = sessionsHistory.filter((s) => s.patientId === selectedPatient?.id) || [];

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!newTargetAngle || isNaN(newTargetAngle)) return;
    onUpdatePatientGoal(selectedPatient.id, parseInt(newTargetAngle, 10));
    setSuccessMsg(`Target extension for ${selectedPatient.name} updated to ${newTargetAngle}°!`);
    setNewTargetAngle('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="clinician-page animate-fade-in">
      {/* Clinician Header Banner */}
      <div className="welcome-card clinician-banner">
        <div className="welcome-content">
          <span className="badge badge-purple">🩺 {clinician.specialty}</span>
          <h1>{clinician.name}</h1>
          <p className="welcome-sub">{clinician.hospital} • {t('clinicianSub')}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Assigned Patients Roster */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('assignedPatients')} ({clinicianPatients.length})</h2>
              <p className="section-sub">Select a senior patient to inspect telemetry & adjust target goals</p>
            </div>
          </div>

          <div className="patient-roster-list">
            {clinicianPatients.map((patient) => {
              const isSelected = patient.id === selectedPatientId;
              return (
                <div
                  key={patient.id}
                  className={`patient-roster-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPatientId(patient.id)}
                >
                  <div className="patient-avatar-box">
                    <span className="patient-avatar-letter">{patient.name.charAt(0)}</span>
                  </div>

                  <div className="patient-main-info">
                    <div className="patient-title-row">
                      <h4>{patient.name}</h4>
                      <span className="badge badge-outline">Age {patient.age}</span>
                    </div>
                    <p className="patient-cond-text">{patient.condition}</p>
                    <div className="patient-mini-stats">
                      <span>🎯 Goal: {patient.targetExtension}°</span>
                      <span>Peak: {patient.currentMaxExtension}°</span>
                      <span className="text-emerald">⚡ {patient.complianceRate}% Adherence</span>
                    </div>
                  </div>

                  <div className="patient-action-arrow">
                    {isSelected ? '➔' : '›'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Patient Details & Protocol Adjustment */}
        <div className="dashboard-sidebar">
          {selectedPatient && (
            <>
              <div className="sidebar-card patient-detail-card">
                <div className="card-title-row">
                  <h3>{selectedPatient.name} (ID: {selectedPatient.id})</h3>
                  <span className="badge badge-teal">Age {selectedPatient.age}</span>
                </div>

                <div className="detail-stat-rows">
                  <div className="detail-stat-row">
                    <span className="detail-label">Condition:</span>
                    <span className="detail-val">{selectedPatient.condition}</span>
                  </div>

                  <div className="detail-stat-row">
                    <span className="detail-label">Compliance Rate:</span>
                    <span className="detail-val text-emerald">{selectedPatient.complianceRate}%</span>
                  </div>

                  <div className="detail-stat-row">
                    <span className="detail-label">Streak:</span>
                    <span className="detail-val text-amber">{selectedPatient.streakDays} Days 🔥</span>
                  </div>

                  <div className="detail-stat-row">
                    <span className="detail-label">Current Max ROM:</span>
                    <span className="detail-val text-cyan">{selectedPatient.currentMaxExtension}°</span>
                  </div>

                  <div className="detail-stat-row">
                    <span className="detail-label">Assigned Target:</span>
                    <span className="detail-val text-teal font-bold">{selectedPatient.targetExtension}°</span>
                  </div>
                </div>

                <div className="adjust-protocol-box">
                  <h4>⚡ {t('adjustGoal')}</h4>
                  <form onSubmit={handleGoalSubmit} className="goal-form">
                    <input
                      type="number"
                      placeholder={`New Target Angle (e.g. ${selectedPatient.targetExtension + 5})`}
                      value={newTargetAngle}
                      onChange={(e) => setNewTargetAngle(e.target.value)}
                      min="10"
                      max="90"
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Update Goal
                    </button>
                  </form>
                  {successMsg && <p className="success-text">{successMsg}</p>}
                </div>
              </div>

              {/* Session History for Selected Patient */}
              <div className="sidebar-card">
                <div className="card-title-row">
                  <h3>Patient Session History</h3>
                  <span className="badge badge-outline">{patientSessions.length} Logs</span>
                </div>

                <div className="patient-sessions-mini">
                  {patientSessions.length > 0 ? (
                    patientSessions.map((sess) => (
                      <div key={sess.id} className="mini-session-item">
                        <div className="mini-sess-info">
                          <span className="mini-sess-title">{sess.exerciseTitle}</span>
                          <span className="mini-sess-time">{sess.date}</span>
                        </div>
                        <div className="mini-sess-badge">
                          {sess.maxAngleAchieved}° Peak (Pain: {sess.painLevel}/10)
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-mini">No sessions recorded yet for this patient.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
