import React, { useState } from 'react';

export default function ExercisesPage({ exercises, onStartExercise, patient, t }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Prescribed', 'Wrist Joint Mobility', 'Finger Dexterity', 'Wrist Stability', 'Muscle Strengthening'];

  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Prescribed'
        ? ex.badge === 'Prescribed'
        : ex.category === selectedCategory;

    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="exercises-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>{t('exercisesHeader')}</h1>
          <p className="page-sub">{t('exercisesSub')}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="toolbar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? t('all') : cat === 'Prescribed' ? t('prescribed') : cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Exercises Cards Grid */}
      <div className="exercises-grid">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <div className="card-top-bar" style={{ backgroundColor: exercise.color }}></div>

            <div className="card-body">
              <div className="card-header-row">
                <span className="badge badge-category">{exercise.category}</span>
                <span className={`badge ${exercise.badge === 'Prescribed' ? 'badge-teal' : 'badge-outline'}`}>
                  {exercise.badge === 'Prescribed' ? t('prescribed') : exercise.badge}
                </span>
              </div>

              <h3 className="exercise-card-title">{exercise.title}</h3>
              <p className="exercise-card-desc">{exercise.description}</p>

              <div className="specs-box">
                <div className="spec-item">
                  <span className="spec-title">{t('targetRom')}</span>
                  <strong className="spec-value text-teal">{patient?.targetExtension || exercise.targetAngle}° Angle</strong>
                </div>

                <div className="spec-item">
                  <span className="spec-title">{t('duration')}</span>
                  <strong className="spec-value">{exercise.durationSeconds} sec</strong>
                </div>

                <div className="spec-item">
                  <span className="spec-title">{t('targetReps')}</span>
                  <strong className="spec-value">{exercise.recommendedReps} reps</strong>
                </div>

                <div className="spec-item">
                  <span className="spec-title">{t('difficulty')}</span>
                  <strong className="spec-value">{exercise.difficulty}</strong>
                </div>
              </div>

              <div className="instructions-section">
                <div className="instruct-title-row">
                  <strong>{t('protocolSteps')}:</strong>
                  <button
                    className="btn-link btn-xs"
                    onClick={() => speakText(`${exercise.title}. ${exercise.instructions.join('. ')}`)}
                  >
                    {t('readAloud')}
                  </button>
                </div>
                <ol className="instruction-list">
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <button
                className="btn btn-primary full-width btn-md"
                onClick={() => onStartExercise(exercise)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                {t('startExerciseSession')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
