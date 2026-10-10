import React from 'react';

export default function DashboardPage({
  patient,
  device,
  exercises,
  recentSessions,
  onStartExercise,
  onViewAllExercises,
  onViewProgress,
  onOpenDeviceModal,
  t
}) {
  const primaryExercise = exercises.find((e) => e.id === 'wrist-extension') || exercises[0];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-card">
        <div className="welcome-content">
          <div className="welcome-header">
            <span className="badge badge-teal">Patient ID: {patient.id}</span>
            <span className="badge badge-blue">Age {patient.age}</span>
            <span className="badge badge-purple">{patient.condition}</span>
          </div>
          <h1>{t('welcomeGreeting')}, {patient.name}! 👋</h1>
          <p className="welcome-sub">
            Your Dextra Orthosis is connected and ready. You have completed {patient.completedTodayCount} of {patient.totalPrescribedDaily} scheduled sessions today.
          </p>

          <div className="welcome-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onStartExercise(primaryExercise)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              {t('startTodaySession')}: {primaryExercise.title}
            </button>

            <button className="btn btn-secondary" onClick={onViewAllExercises}>
              {t('browseExercises')}
            </button>

            <button
              className="btn btn-outline"
              onClick={() => speakText(`${t('welcomeGreeting')} ${patient.name}. You have completed ${patient.completedTodayCount} of ${patient.totalPrescribedDaily} sessions today.`)}
              title="Read Aloud for Seniors"
            >
              {t('readAloud')}
            </button>
          </div>
        </div>

        <div className="welcome-graphic">
          <div className="orthosis-visual">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5">
              <rect x="7" y="10" width="10" height="11" rx="2" strokeWidth="2"></rect>
              <path d="M7 10L10 3C10.5 2 12 2 12.5 3L13 7" strokeWidth="2" strokeLinecap="round"></path>
              <path d="M12 10V5" strokeWidth="2" strokeLinecap="round"></path>
              <circle cx="12" cy="15.5" r="2" fill="#06b6d4"></circle>
            </svg>
            <div className="pulse-ring"></div>
          </div>
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
              {patient.completedTodayCount} <span className="metric-unit">/ {patient.totalPrescribedDaily} Sessions</span>
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
            <span className="metric-label">{t('rehabStreak')}</span>
            <div className="metric-value">
              {patient.streakDays} <span className="metric-unit">Consecutive Days 🔥</span>
            </div>
            <span className="metric-subtext">Senior daily habit building</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('peakAngle')}</span>
            <div className="metric-value">
              {patient.currentMaxExtension}° <span className="metric-unit">/ {patient.targetExtension}° Goal</span>
            </div>
            <span className="metric-subtext">Assigned by {patient.therapist}</span>
          </div>
        </div>

        <div className="metric-card clickable" onClick={onOpenDeviceModal}>
          <div className="metric-icon icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('dextraHardware')}</span>
            <div className="metric-value text-emerald">
              {t('connected')} <span className="metric-unit">({device.battery}%)</span>
            </div>
            <span className="metric-subtext">Senior Soft-Drive Active ›</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('prescribedExercises')}</h2>
              <p className="section-sub">Therapist: {patient.therapist}</p>
            </div>
            <button className="btn-link" onClick={onViewAllExercises}>
              {t('viewAll')} ({exercises.length}) →
            </button>
          </div>

          <div className="exercise-card-list">
            {exercises.slice(0, 3).map((exercise) => (
              <div key={exercise.id} className="exercise-item-card">
                <div className="exercise-color-strip" style={{ backgroundColor: exercise.color }}></div>
                <div className="exercise-item-details">
                  <div className="exercise-title-row">
                    <h4>{exercise.title}</h4>
                    <span className="badge badge-outline">{exercise.category}</span>
                  </div>
                  <p className="exercise-desc">{exercise.description}</p>

                  <div className="exercise-meta-row">
                    <span>⏱️ {exercise.durationSeconds} sec</span>
                    <span>🎯 Goal: {patient.targetExtension || exercise.targetAngle}° ROM</span>
                    <span>🔄 {exercise.recommendedReps} Reps</span>
                  </div>
                </div>

                <div className="exercise-item-action">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onStartExercise(exercise)}
                  >
                    {t('startExerciseSession')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-card device-info-card">
            <div className="card-title-row">
              <h3>Dextra Hardware Status</h3>
              <span className="status-dot online"></span>
            </div>
            <ul className="device-spec-list">
              <li>
                <span className="spec-label">Device Model:</span>
                <span className="spec-val">{device.name}</span>
              </li>
              <li>
                <span className="spec-label">Battery Level:</span>
                <span className="spec-val text-emerald">⚡ {device.battery}%</span>
              </li>
              <li>
                <span className="spec-label">Actuator Motors:</span>
                <span className="spec-val">Senior Soft-Drive (0.8 Nm)</span>
              </li>
              <li>
                <span className="spec-label">Calibration:</span>
                <span className="spec-val">{device.lastCalibrated}</span>
              </li>
            </ul>

            <button className="btn btn-outline full-width btn-sm" onClick={onOpenDeviceModal}>
              Diagnostics Console
            </button>
          </div>

          <div className="sidebar-card">
            <div className="card-title-row">
              <h3>{t('recentSessions')}</h3>
              <button className="btn-link" onClick={onViewProgress}>{t('viewAll')} →</button>
            </div>

            <div className="recent-sessions-mini">
              {recentSessions.slice(0, 3).map((sess) => (
                <div key={sess.id} className="mini-session-item">
                  <div className="mini-sess-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="mini-sess-info">
                    <span className="mini-sess-title">{sess.exerciseTitle}</span>
                    <span className="mini-sess-time">{sess.date}</span>
                  </div>
                  <div className="mini-sess-badge">
                    {sess.maxAngleAchieved}° Peak
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
