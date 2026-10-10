import React, { useState, useEffect } from 'react';

export default function SessionPage({ exercise, patient, onCompleteSession, onCancelSession, t }) {
  const totalTime = exercise?.durationSeconds || 60;
  const targetAngle = patient?.targetExtension || exercise?.targetAngle || 35;

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [repsDone, setRepsDone] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [peakAngle, setPeakAngle] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [painLevel, setPainLevel] = useState(2);

  // Speech Helper for Seniors
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const nextTime = prev - 1;
          const elapsed = totalTime - nextTime;

          const cycleDuration = 6;
          const phase = (elapsed % cycleDuration) / cycleDuration;
          const simulatedAngle = Math.round(Math.abs(Math.sin(phase * Math.PI)) * targetAngle);

          setCurrentAngle(simulatedAngle);
          setPeakAngle((max) => Math.max(max, simulatedAngle));

          if (elapsed > 0 && elapsed % cycleDuration === 0) {
            setRepsDone((r) => r + 1);
          }

          if (nextTime === 0) {
            setIsRunning(false);
            setShowSummaryModal(true);
            speakText(t('sessionCompleteTitle'));
          }
          return nextTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, totalTime, targetAngle, t]);

  const handleStartPause = () => {
    if (!isRunning) {
      speakText(`${t('startTimer')}. ${exercise.title}`);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setCurrentAngle(0);
    setPeakAngle(0);
    setRepsDone(0);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    setShowSummaryModal(true);
    speakText(t('sessionCompleteTitle'));
  };

  const handleSaveSession = () => {
    const sessionData = {
      patientId: patient?.id || 'DEX-7012',
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      durationSec: totalTime - timeLeft,
      targetAngle: targetAngle,
      maxAngleAchieved: peakAngle > 0 ? peakAngle : Math.round(targetAngle * 0.85),
      repsCompleted: repsDone > 0 ? repsDone : exercise.recommendedReps,
      painLevel: painLevel,
    };
    onCompleteSession(sessionData);
  };

  const progressPercent = Math.min(100, Math.round(((totalTime - timeLeft) / totalTime) * 100));

  return (
    <div className="session-page animate-fade-in">
      <div className="session-header">
        <button className="btn btn-secondary btn-sm" onClick={onCancelSession}>
          ← {t('exitSession')}
        </button>
        <div className="session-title-box">
          <span className="badge badge-teal">{exercise.category}</span>
          <h2>{exercise.title}</h2>
        </div>
        <div className="session-device-badge">
          <span className="status-dot online"></span> Orthosis Soft-Drive Active
        </div>
      </div>

      <div className="session-arena">
        <div className="session-control-panel">
          <div className="timer-circle-container">
            <svg className="timer-svg" viewBox="0 0 160 160">
              <circle className="timer-bg" cx="80" cy="80" r="70" />
              <circle
                className="timer-progress"
                cx="80"
                cy="80"
                r="70"
                style={{
                  strokeDasharray: 440,
                  strokeDashoffset: 440 - (440 * progressPercent) / 100,
                }}
              />
            </svg>

            <div className="timer-display">
              <span className="timer-time">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="timer-label">{t('timeRemaining')}</span>
            </div>
          </div>

          <div className="session-stats-row">
            <div className="sess-stat-box">
              <span className="sess-stat-label">{t('repetitions')}</span>
              <span className="sess-stat-val text-teal">{repsDone} <small>/ {exercise.recommendedReps}</small></span>
            </div>

            <div className="sess-stat-box">
              <span className="sess-stat-label">{t('currentAngle')}</span>
              <span className="sess-stat-val text-cyan">{currentAngle}°</span>
            </div>

            <div className="sess-stat-box">
              <span className="sess-stat-label">{t('peakFlexion')}</span>
              <span className="sess-stat-val text-emerald">{peakAngle}°</span>
            </div>
          </div>

          <div className="session-controls">
            <button
              className={`btn ${isRunning ? 'btn-amber' : 'btn-primary'} btn-lg session-btn`}
              onClick={handleStartPause}
            >
              {isRunning ? t('pauseSession') : timeLeft < totalTime ? t('resumeSession') : t('startTimer')}
            </button>

            <div className="dual-controls">
              <button className="btn btn-secondary flex-1" onClick={handleReset}>
                🔄 {t('reset')}
              </button>
              <button className="btn btn-emerald flex-1" onClick={handleFinishEarly}>
                ✓ {t('completeSession')}
              </button>
            </div>
          </div>
        </div>

        {/* Live Visualizer */}
        <div className="session-visualizer-card">
          <div className="visualizer-header">
            <h3>{t('liveVisualizer')}</h3>
            <span className="live-pill">● LIVE TELEMETRY</span>
          </div>

          <div className="visualizer-stage">
            <div className="wrist-graphic-container">
              <svg width="320" height="240" viewBox="0 0 320 240">
                <line x1="40" y1="190" x2="280" y2="190" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="160" y1="30" x2="160" y2="190" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                <path
                  d={`M 160 190 A 90 90 0 0 0 ${160 + 90 * Math.sin((targetAngle * Math.PI) / 180)} ${190 - 90 * Math.cos((targetAngle * Math.PI) / 180)}`}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {currentAngle > 0 && (
                  <path
                    d={`M 160 190 A 90 90 0 0 0 ${160 + 90 * Math.sin((currentAngle * Math.PI) / 180)} ${190 - 90 * Math.cos((currentAngle * Math.PI) / 180)}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                )}

                <rect x="70" y="180" width="90" height="20" rx="6" fill="#475569" />
                <text x="75" y="195" fill="#94a3b8" fontSize="11">Forearm Brace</text>

                <circle cx="160" cy="190" r="10" fill="#06b6d4" />
                <circle cx="160" cy="190" r="4" fill="#0f172a" />

                <g transform={`rotate(${-currentAngle}, 160, 190)`}>
                  <rect x="160" y="182" width="100" height="16" rx="6" fill="#0284c7" />
                  <circle cx="250" cy="190" r="8" fill="#38bdf8" />
                  <text x="175" y="194" fill="#ffffff" fontSize="10" fontWeight="bold">Dextra Arm</text>
                </g>

                <text x="200" y="60" fill="#06b6d4" fontSize="12" fontWeight="bold">
                  Target: {targetAngle}°
                </text>
              </svg>
            </div>

            <div className="visualizer-angle-meter">
              <div className="meter-label">Active Angle Range of Motion</div>
              <div className="meter-reading">
                <span className="current-deg">{currentAngle}°</span>
                <span className="goal-deg">/ {targetAngle}° Target</span>
              </div>
              <div className="angle-progress-bar">
                <div
                  className="angle-progress-fill"
                  style={{ width: `${Math.min(100, (currentAngle / targetAngle) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showSummaryModal && (
        <div className="modal-overlay">
          <div className="modal-card animate-scale-up">
            <div className="modal-header">
              <div className="modal-icon text-emerald">🎉</div>
              <h3>{t('sessionCompleteTitle')}</h3>
              <p>Great job! Here is your session summary.</p>
            </div>

            <div className="summary-stats-grid">
              <div className="summary-stat">
                <span>Peak Angle Achieved</span>
                <strong>{peakAngle > 0 ? peakAngle : Math.round(targetAngle * 0.88)}° ROM</strong>
              </div>

              <div className="summary-stat">
                <span>Completed Reps</span>
                <strong>{repsDone > 0 ? repsDone : exercise.recommendedReps} Reps</strong>
              </div>

              <div className="summary-stat">
                <span>Session Duration</span>
                <strong>{totalTime - timeLeft} sec</strong>
              </div>

              <div className="summary-stat">
                <span>Dextra Motor Sync</span>
                <strong className="text-emerald">100% Calibrated</strong>
              </div>
            </div>

            <div className="pain-selector-section">
              <label>{t('painLevelQuestion')}</label>
              <div className="pain-buttons">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`pain-num-btn ${painLevel === num ? 'selected' : ''}`}
                    onClick={() => setPainLevel(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary full-width btn-lg" onClick={handleSaveSession}>
                💾 {t('saveAndViewProgress')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
