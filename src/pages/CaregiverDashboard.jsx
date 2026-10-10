import React, { useState } from 'react';
import { getTranslation } from '../translations';

export default function CaregiverDashboard({ caregiverUser, patientUser, completedSessions, lang }) {
  const t = (key) => getTranslation(key, lang);
  const [showContactModal, setShowContactModal] = useState(false);

  const patient = patientUser || {
    name: "Lakshmi Devi",
    age: 68,
    condition: "Limited hand & wrist mobility",
    streakDays: 6,
    completedTodayCount: 1,
    totalPrescribedDaily: 3,
    overallProgressPercent: 78,
    physioName: "Dr. Ananya Rao",
  };

  return (
    <div className="caregiver-page animate-fade-in">
      <div className="welcome-card caregiver-banner">
        <div className="welcome-content">
          <span className="badge badge-purple">🏠 {t('caregiverTitle')}</span>
          <h1>Welcome, {caregiverUser.name}! 👋</h1>
          <p className="welcome-sub">
            {t('caregiverSub')} • {t('linkedPatient')}: <strong>{patient.name}</strong> ({patient.age} yrs)
          </p>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => setShowContactModal(true)}>
            {t('contactPhysioBtn')}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon icon-teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('todayProgress')}</span>
            <div className="metric-value">
              {patient.completedTodayCount} <span className="metric-unit">/ {patient.totalPrescribedDaily} {t('exercisesCompleted')}</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(patient.completedTodayCount / patient.totalPrescribedDaily) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('patientStreak')}</span>
            <div className="metric-value text-amber">{patient.streakDays} Days 🔥</div>
            <span className="metric-subtext">Consistent daily exercises</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('overallProgress')}</span>
            <div className="metric-value text-emerald">{patient.overallProgressPercent}%</div>
            <span className="metric-subtext">Assigned by {patient.physioName}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Patient Rehabilitation Log</h3>
            <span className="badge badge-outline">{completedSessions.length} Sessions</span>
          </div>

          <div className="recent-sessions-mini">
            {completedSessions.map((sess) => (
              <div key={sess.id} className="mini-session-item">
                <div className="mini-sess-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="mini-sess-info">
                  <span className="mini-sess-title">{sess.exerciseName}</span>
                  <span className="mini-sess-time">{sess.date}</span>
                </div>
                <div className="mini-sess-badge text-emerald">
                  ✓ {sess.repsCompleted} Reps ({sess.durationSec}s)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="sidebar-card">
            <h3>Patient Profile Overview</h3>
            <ul className="device-spec-list">
              <li>
                <span className="spec-label">Name:</span>
                <span className="spec-val">{patient.name}</span>
              </li>
              <li>
                <span className="spec-label">Age:</span>
                <span className="spec-val">{patient.age} years</span>
              </li>
              <li>
                <span className="spec-label">Condition:</span>
                <span className="spec-val">{patient.condition}</span>
              </li>
              <li>
                <span className="spec-label">Goal:</span>
                <span className="spec-val">{patient.rehabGoal}</span>
              </li>
              <li>
                <span className="spec-label">Physiotherapist:</span>
                <span className="spec-val">{patient.physioName}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Physio Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon text-teal">🩺</div>
              <h3>Contact Physiotherapist</h3>
              <p>Direct communication link with {patient.physioName}</p>
            </div>

            <div className="contact-details-box">
              <p><strong>Clinic:</strong> Dextra Neuro & Ortho Rehab</p>
              <p><strong>Phone:</strong> +91 98765 12345</p>
              <p><strong>Email:</strong> dr.ananya@dextra.com</p>
              <p><strong>Hours:</strong> Mon - Sat (9:00 AM - 5:00 PM)</p>
            </div>

            <div className="modal-actions mt-16">
              <button className="btn btn-secondary full-width" onClick={() => setShowContactModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
