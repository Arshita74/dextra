import React from 'react';
import { getTranslation } from '../translations';

export default function HelpPage({ lang }) {
  const t = (key) => getTranslation(key, lang);

  return (
    <div className="help-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>{t('helpTitle')}</h1>
          <p className="page-sub">{t('helpSub')}</p>
        </div>
      </div>

      <div className="help-grid">
        <div className="help-card">
          <div className="help-icon text-teal">🦾</div>
          <h3>1. How to Wear & Use Dextra Orthosis</h3>
          <p>
            Secure the soft velcro straps comfortably around your forearm and fingers. Ensure your hand rests in a neutral, strain-free position before starting any exercise.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon text-cyan">▶️</div>
          <h3>2. How to Start an Exercise</h3>
          <p>
            From the Dashboard or My Exercises page, tap the big <strong>"Start Today's Exercise"</strong> button. The large timer and live motion screen will guide your movement.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon text-emerald">📊</div>
          <h3>3. How Progress is Tracked</h3>
          <p>
            Every completed exercise automatically updates your daily count, streak days, and recovery progress percentage.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon text-amber">🏠</div>
          <h3>4. How Caregivers Can Monitor</h3>
          <p>
            Caregivers log in using their Caregiver Portal account to view real-time patient completion rates, streak metrics, and contact the physiotherapist directly.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon text-purple">🩺</div>
          <h3>5. How Physiotherapists Manage Protocols</h3>
          <p>
            Physiotherapists log in to inspect patient rosters, adjust target angles and durations, and record clinical rehabilitation notes.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon text-rose">⚡</div>
          <h3>6. Hardware Connection Disclaimer</h3>
          <p className="hardware-notice-text">
            {t('hardwareNotice')}
          </p>
        </div>
      </div>
    </div>
  );
}
