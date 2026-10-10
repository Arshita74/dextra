import React, { useState } from 'react';
import { getTranslation } from '../translations';

export default function PhysioDashboard({ physioUser, patientsList, exercisesList, completedSessions, lang, onUpdateExerciseConfig }) {
  const t = (key) => getTranslation(key, lang);
  const [selectedPatientId, setSelectedPatientId] = useState(patientsList[0]?.id || 'user-patient-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState(() => {
    const saved = localStorage.getItem('dextra_physio_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, patientId: 'user-patient-1', date: '2026-10-06', text: 'Patient Lakshmi Devi shows +12% improvement in grip release motion. Instructed to maintain daily streak.' }
    ];
  });

  const selectedPatient = patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];
  const patientSessions = completedSessions.filter((s) => !s.patientId || s.patientId === selectedPatient?.id);
  const patientNotes = notesList.filter((n) => n.patientId === selectedPatient?.id);

  const filteredPatients = patientsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: Date.now(),
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      text: noteText,
    };
    const updated = [newNote, ...notesList];
    setNotesList(updated);
    localStorage.setItem('dextra_physio_notes', JSON.stringify(updated));
    setNoteText('');
  };

  return (
    <div className="physio-page animate-fade-in">
      <div className="welcome-card physio-banner">
        <div className="welcome-content">
          <span className="badge badge-purple">🩺 {t('physioTitle')}</span>
          <h1>Welcome, {physioUser.name}! 👋</h1>
          <p className="welcome-sub">{physioUser.hospital} • {t('physioSub')}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Patient Roster & Search */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('assignedPatientRoster')} ({patientsList.length})</h2>
              <p className="section-sub">Select patient to view clinical telemetry & prescribe exercises</p>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder={t('searchPatientPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="patient-roster-list">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  className={`patient-roster-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPatientId(p.id)}
                >
                  <div className="patient-avatar-box">
                    <span className="patient-avatar-letter">{p.name.charAt(0)}</span>
                  </div>

                  <div className="patient-main-info">
                    <div className="patient-title-row">
                      <h4>{p.name}</h4>
                      <span className="badge badge-outline">Age {p.age}</span>
                    </div>
                    <p className="patient-cond-text">{p.condition}</p>
                    <div className="patient-mini-stats">
                      <span className="text-emerald">Streak: {p.streakDays} days</span>
                      <span className="text-teal">Overall: {p.overallProgressPercent}%</span>
                    </div>
                  </div>

                  <div className="patient-action-arrow">{isSelected ? '➔' : '›'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Clinical Prescriptions & Notes */}
        <div className="dashboard-sidebar">
          {selectedPatient && (
            <>
              <div className="sidebar-card">
                <h3>Clinical Summary: {selectedPatient.name}</h3>
                <ul className="device-spec-list">
                  <li>
                    <span className="spec-label">Condition:</span>
                    <span className="spec-val">{selectedPatient.condition}</span>
                  </li>
                  <li>
                    <span className="spec-label">Rehab Goal:</span>
                    <span className="spec-val">{selectedPatient.rehabGoal}</span>
                  </li>
                  <li>
                    <span className="spec-label">Emergency Contact:</span>
                    <span className="spec-val">{selectedPatient.emergencyContact}</span>
                  </li>
                  <li>
                    <span className="spec-label">Overall Progress:</span>
                    <span className="spec-val text-emerald font-bold">{selectedPatient.overallProgressPercent}%</span>
                  </li>
                </ul>
              </div>

              {/* Add Clinical Notes */}
              <div className="sidebar-card">
                <h3>{t('clinicalNotesTitle')}</h3>
                <form onSubmit={handleAddNote} className="note-form mt-12">
                  <textarea
                    rows="3"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={t('addNotePlaceholder')}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary btn-sm full-width mt-8">
                    {t('saveNoteBtn')}
                  </button>
                </form>

                <div className="notes-history-list mt-16">
                  {patientNotes.map((note) => (
                    <div key={note.id} className="note-item">
                      <span className="note-date">{note.date}</span>
                      <p className="note-text">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
