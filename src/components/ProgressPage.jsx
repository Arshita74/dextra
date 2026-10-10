import React, { useState } from 'react';
import { ROM_HISTORY_CHART } from '../data/mockData';

export default function ProgressPage({ sessionsHistory, patient, onStartNewExercise, t }) {
  const [filterExercise, setFilterExercise] = useState('All');

  // Filter sessions for this patient
  const patientSessions = sessionsHistory.filter((s) => !s.patientId || s.patientId === patient?.id);

  const totalSessions = patientSessions.length;
  const maxAngleOverall = Math.max(...patientSessions.map((s) => s.maxAngleAchieved || 0), patient?.currentMaxExtension || 28);
  const avgPain = (
    patientSessions.reduce((acc, s) => acc + (s.painLevel || 2), 0) / (totalSessions || 1)
  ).toFixed(1);

  const filteredSessions = patientSessions.filter((s) =>
    filterExercise === 'All' ? true : s.exerciseTitle === filterExercise
  );

  return (
    <div className="progress-page animate-fade-in">
      <div className="page-header print-hide">
        <div>
          <h1>{t('progressHeader')}</h1>
          <p className="page-sub">{t('progressSub')} ({patient?.name})</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            🖨️ {t('exportReport')}
          </button>
          <button className="btn btn-primary" onClick={onStartNewExercise}>
            {t('newSession')}
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon icon-teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('maxAchieved')}</span>
            <div className="metric-value text-teal">{maxAngleOverall}° ROM</div>
            <span className="metric-subtext">Goal: {patient?.targetExtension || 35}° Target</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('totalCompleted')}</span>
            <div className="metric-value">{totalSessions} Sessions</div>
            <span className="metric-subtext">100% Prescribed Protocol Adherence</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('avgPain')}</span>
            <div className="metric-value">{avgPain} / 10</div>
            <span className="metric-subtext text-emerald">Well within comfortable tolerance</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">{t('assignedTherapist')}</span>
            <div className="metric-value">{patient?.therapist}</div>
            <span className="metric-subtext">Senior Protocol Active</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Weekly Range of Motion (ROM) Improvement</h3>
            <p className="chart-sub">Tracked extension angle (degrees) vs assigned therapist target ({patient?.targetExtension || 35}°)</p>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-box bar-teal"></span> Achieved ROM (°)</span>
            <span className="legend-item"><span className="legend-line line-red"></span> Target Goal ({patient?.targetExtension || 35}°)</span>
          </div>
        </div>

        <div className="chart-container">
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 700 240" className="chart-svg">
              {[0, 10, 20, 30, 40].map((val) => {
                const y = 200 - (val / 45) * 170;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="680" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="10" y={y + 4} fill="#94a3b8" fontSize="11">{val}°</text>
                  </g>
                );
              })}

              <line
                x1="40"
                y1={200 - ((patient?.targetExtension || 35) / 45) * 170}
                x2="680"
                y2={200 - ((patient?.targetExtension || 35) / 45) * 170}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {ROM_HISTORY_CHART.map((item, idx) => {
                const x = 70 + idx * 88;
                const barHeight = (item.angle / 45) * 170;
                const y = 200 - barHeight;
                return (
                  <g key={item.day} className="chart-bar-group">
                    <rect
                      x={x}
                      y={y}
                      width="42"
                      height={barHeight}
                      rx="6"
                      fill="url(#tealGradient)"
                      className="chart-bar"
                    />
                    <text x={x + 21} y={y - 8} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {item.angle}°
                    </text>
                    <text x={x + 21} y="222" fill="#cbd5e1" fontSize="12" textAnchor="middle">
                      {item.day}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Session History Table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h3>Exercise Session History Log</h3>
            <p className="table-sub">Detailed logs recorded from Dextra Orthosis onboard telemetry</p>
          </div>
          <div className="table-filter">
            <select value={filterExercise} onChange={(e) => setFilterExercise(e.target.value)}>
              <option value="All">All Exercises</option>
              <option value="Wrist Extension & Flexion">Wrist Extension & Flexion</option>
              <option value="Finger Extension & Grip Assist">Finger Extension & Grip Assist</option>
              <option value="Radial & Ulnar Deviation">Radial & Ulnar Deviation</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Exercise Protocol</th>
                <th>Duration</th>
                <th>Peak Angle Achieved</th>
                <th>Target Angle</th>
                <th>Reps</th>
                <th>Pain Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((sess) => (
                <tr key={sess.id}>
                  <td className="font-mono">{sess.date}</td>
                  <td>
                    <strong>{sess.exerciseTitle}</strong>
                  </td>
                  <td>{sess.durationSec}s</td>
                  <td>
                    <span className="text-teal font-bold">{sess.maxAngleAchieved}°</span>
                  </td>
                  <td>{sess.targetAngle}°</td>
                  <td>{sess.repsCompleted} reps</td>
                  <td>
                    <span className={`pain-badge pain-${sess.painLevel}`}>
                      Level {sess.painLevel}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-emerald">✓ Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
