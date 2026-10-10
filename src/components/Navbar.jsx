import React from 'react';
import { getTranslation } from '../translations';

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  lang,
  onChangeLanguage,
  fontSizeScale,
  onChangeFontSize,
  highContrast,
  onToggleHighContrast,
  onLogout
}) {
  const t = (key) => getTranslation(key, lang);
  const role = user?.role || 'patient';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Header */}
        <div className="navbar-brand" onClick={() => setActiveTab(role === 'patient' ? 'dashboard' : role)}>
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">{t('brandName')}</span>
            <span className="brand-sub">{t('brandSubtitle')}</span>
          </div>
        </div>

        {/* Dynamic Navigation Links per Role */}
        <nav className="navbar-nav">
          {role === 'patient' && (
            <>
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                🏠 {t('navDashboard')}
              </button>

              <button
                className={`nav-link ${activeTab === 'exercises' || activeTab === 'session' ? 'active' : ''}`}
                onClick={() => setActiveTab('exercises')}
              >
                💪 {t('navMyExercises')}
              </button>

              <button
                className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                📊 {t('navProgress')}
              </button>

              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                👤 {t('navProfile')}
              </button>

              <button
                className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                ❓ {t('navHelp')}
              </button>
            </>
          )}

          {role === 'caregiver' && (
            <>
              <button
                className={`nav-link ${activeTab === 'caregiver' ? 'active' : ''}`}
                onClick={() => setActiveTab('caregiver')}
              >
                🏠 {t('navCaregiverView')}
              </button>

              <button
                className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                📊 {t('navProgress')}
              </button>

              <button
                className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                ❓ {t('navHelp')}
              </button>
            </>
          )}

          {role === 'physiotherapist' && (
            <>
              <button
                className={`nav-link ${activeTab === 'physio' ? 'active' : ''}`}
                onClick={() => setActiveTab('physio')}
              >
                🩺 {t('navPhysioPortal')}
              </button>

              <button
                className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                ❓ {t('navHelp')}
              </button>
            </>
          )}

          {role === 'administrator' && (
            <>
              <button
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                ⚙️ {t('navAdminPortal')}
              </button>

              <button
                className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                ❓ {t('navHelp')}
              </button>
            </>
          )}
        </nav>

        {/* Accessibility & Language Controls */}
        <div className="navbar-actions">
          {/* Elder Font Size Scaler */}
          <div className="font-scaler-group" title="Elder Text Size Controller">
            <span className="scaler-label">🔍</span>
            <button
              className={`font-btn ${fontSizeScale === 'normal' ? 'active' : ''}`}
              onClick={() => onChangeFontSize('normal')}
            >
              A
            </button>
            <button
              className={`font-btn ${fontSizeScale === 'large' ? 'active' : ''}`}
              onClick={() => onChangeFontSize('large')}
            >
              A+
            </button>
            <button
              className={`font-btn ${fontSizeScale === 'xlarge' ? 'active' : ''}`}
              onClick={() => onChangeFontSize('xlarge')}
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            className={`btn-contrast-toggle ${highContrast ? 'active' : ''}`}
            onClick={onToggleHighContrast}
            title="Toggle High Contrast Mode for Elders"
          >
            👁️ Contrast
          </button>

          {/* Multilingual Selector */}
          <div className="language-selector-box">
            <select
              value={lang}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="en">🇺🇸 English</option>
              <option value="te">🇮🇳 తెలుగు (Telugu)</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* User Profile Badge */}
          <div className="user-profile">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role-tag badge badge-teal">{role.toUpperCase()}</span>
            </div>
            <button className="logout-btn" onClick={onLogout} title={t('navLogout')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
