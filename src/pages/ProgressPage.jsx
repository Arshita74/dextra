import React from 'react';
import { getTranslation } from '../translations';

export default function ProgressPage({ completedSessions, patientUser, onStartNewExercise, lang }) {
  const t = (key) => getTranslation(key, lang);

  const patientSessions = completedSessions.filter((s) => !s.patientId || s.patientId === patientUser?.id);
  const totalSessions = patientSessions.length;
  const totalTimeSec = patientSessions.reduce((acc, s) => acc + (s.durationSec || 60), 0);
  const totalMinutes = Math.round(totalTimeSec / 60);

  return (
    <div className="progress-page animate-fade-in">
      <div className="page-header print-hide">
        <div>
          <h1>{t('progressTitle')}</h1>
          <p className="page-sub">{t('progressSub')} ({patientUser?.name || 'Lakshmi Devi'})</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            🖨️ Print / Export Report
          </button>
          <button className="btn btn-primary" onClick={onStartNewExercise}>
            + {t('navStartExercise')}
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon icon-teal">📊</div>
          <div className="metric-info">
            <span className="metric-label">{t('dailyProgress')}</span>
            <div className="metric-value text-teal">{patientUser?.completedTodayCount || 1} / {patientUser?.totalPrescribedDaily || 3}</div>
            <span className="metric-subtext">Today's exercises</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-emerald">✓</div>
          <div className="metric-info">
            <span className="metric-label">{t('sessionsCompleted')}</span>
            <div className="metric-value text-emerald">{totalSessions} Sessions</div>
            <span className="metric-subtext">100% Protocol Adherence</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-blue">⏱️</div>
          <div className="metric-info">
            <span className="metric-label">{t('totalExerciseTime')}</span>
            <div className="metric-value text-blue">{totalMinutes} Minutes</div>
            <span className="metric-subtext">Total active rehabilitation time</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-amber">🔥</div>
          <div className="metric-info">
            <span className="metric-label">{t('currentStreak')}</span>
            <div className="metric-value text-amber">{patientUser?.streakDays || 6} Days</div>
            <span className="metric-subtext">Consecutive daily exercises</span>
          </div>
        </div>
      </div>

      {/* Interactive Progress Chart */}
      <div className="chart-card mt-24">
        <div className="chart-header">
          <div>
            <h3>{t('weeklyProgress')} & Mobility Improvement</h3>
            <p className="chart-sub">Tracked exercises completed over the past week</p>
          </div>
        </div>

        <div className="chart-container">
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 700 200" className="chart-svg">
              {[0, 1, 2, 3, 4].map((val) => {
                const y = 160 - (val / 4) * 120;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="680" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="15" y={y + 4} fill="#94a3b8" fontSize="11">{val}</text>
                  </g>
                );
              })}

              {[
                { day: "Mon", count: 2 },
                { day: "Tue", count: 3 },
                { day: "Wed", count: 2 },
                { day: "Thu", count: 3 },
                { day: "Fri", count: 2 },
                { day: "Sat", count: 3 },
                { day: "Sun (Today)", count: patientUser?.completedTodayCount || 1 },
              ].map((item, idx) => {
                const x = 70 + idx * 88;
                const barHeight = (item.count / 4) * 120;
                const y = 160 - barHeight;
                return (
                  <g key={item.day}>
                    <rect
                      x={x}
                      y={y}
                      width="42"
                      height={barHeight}
                      rx="6"
                      fill="url(#tealGrad)"
                    />
                    <text x={x + 21} y={y - 8} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {item.count}
                    </text>
                    <text x={x + 21} y="180" fill="#cbd5e1" fontSize="12" textAnchor="middle">
                      {item.day}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="table-card mt-24">
        <div className="table-header">
          <h3>{t('historyLogHeader')}</h3>
          <span className="badge badge-outline">{patientSessions.length} Total Logs</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Exercise Protocol</th>
                <th>Duration</th>
                <th>Repetitions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patientSessions.map((sess) => (
                <tr key={sess.id}>
                  <td className="font-mono">{sess.date}</td>
                  <td><strong>{sess.exerciseName}</strong></td>
                  <td>{sess.durationSec} sec</td>
                  <td>{sess.repsCompleted} reps</td>
                  <td>
                    <span className="badge badge-emerald">✓ {sess.status}</span>
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
