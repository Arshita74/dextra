import React, { useState } from 'react';
import { getTranslation } from '../translations';

export default function PatientProfilePage({ user, onUpdateUser, lang }) {
  const t = (key) => getTranslation(key, lang);

  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.age || 68);
  const [gender, setGender] = useState(user.gender || 'Female');
  const [contact, setContact] = useState(user.contact || '');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '');
  const [rehabGoal, setRehabGoal] = useState(user.rehabGoal || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name,
      age: parseInt(age, 10),
      gender,
      contact,
      emergencyContact,
      rehabGoal,
    };
    onUpdateUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>{t('profileTitle')}</h1>
          <p className="page-sub">{t('profileSub')}</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Profile Avatar Card */}
        <div className="profile-avatar-card">
          <div className="avatar-circle">{name.charAt(0)}</div>
          <h3>{name}</h3>
          <span className="badge badge-teal">ID: {user.id}</span>
          
          <div className="profile-quick-details">
            <p><strong>Role:</strong> {t('rolePatient')}</p>
            <p><strong>Physiotherapist:</strong> {user.physioName || 'Dr. Ananya Rao'}</p>
            <p><strong>Status:</strong> <span className="text-emerald">Active Rehabilitation</span></p>
          </div>
        </div>

        {/* Right Editable Profile Form */}
        <div className="profile-form-card">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="p-name">{t('colName')}</label>
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-age">{t('patientAge')}</label>
                <input
                  id="p-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="p-gender">{t('patientGender')}</label>
                <select id="p-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="p-contact">{t('contactInfo')}</label>
                <input
                  id="p-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="p-emergency">{t('emergencyContact')}</label>
              <input
                id="p-emergency"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. +91 98765 43211 (Son: Ramesh)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="p-goal">{t('rehabilitationGoal')}</label>
              <textarea
                id="p-goal"
                rows="3"
                value={rehabGoal}
                onChange={(e) => setRehabGoal(e.target.value)}
                placeholder="e.g. Improve grip strength and wrist flexion"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              💾 {t('saveProfileBtn')}
            </button>

            {savedSuccess && (
              <div className="alert-success mt-12">
                ✓ {t('profileSavedSuccess')}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
