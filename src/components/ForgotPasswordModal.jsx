import React, { useState } from 'react';
import { getTranslation } from '../translations';

export default function ForgotPasswordModal({ lang, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = (key) => getTranslation(key, lang);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon text-cyan">🔒</div>
          <h3>{t('forgotModalTitle')}</h3>
          <p>{t('forgotModalDesc')}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="reset-email">{t('emailOrUsername')}</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('resetEmailPlaceholder')}
                required
              />
            </div>

            <div className="modal-actions-row">
              <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>
                {t('cancelBtn')}
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                {t('sendResetBtn')}
              </button>
            </div>
          </form>
        ) : (
          <div className="reset-success-box">
            <p className="text-emerald font-bold">✓ {t('resetSuccess')}</p>
            <p className="sub-note">Demo reset email simulated for <strong>{email}</strong>.</p>
            <button className="btn btn-primary full-width mt-16" onClick={onClose}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
