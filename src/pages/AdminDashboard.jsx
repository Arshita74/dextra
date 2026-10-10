import React, { useState } from 'react';
import { getTranslation } from '../translations';

export default function AdminDashboard({ adminUser, usersList, onUpdateUsersList, lang }) {
  const t = (key) => getTranslation(key, lang);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new user
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('patient');
  const [newPassword, setNewPassword] = useState('pass123');

  const patientCount = usersList.filter((u) => u.role === 'patient').length;
  const caregiverCount = usersList.filter((u) => u.role === 'caregiver').length;
  const physioCount = usersList.filter((u) => u.role === 'physiotherapist').length;

  const handleToggleStatus = (userId) => {
    const updated = usersList.map((u) => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' };
      }
      return u;
    });
    onUpdateUsersList(updated);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser = {
      id: `user-${Date.now()}`,
      name: newName,
      email: newEmail,
      username: newEmail,
      password: newPassword,
      role: newRole,
      status: 'Active',
      age: 65,
      condition: 'General Hand Rehabilitation',
    };

    const updated = [...usersList, newUser];
    onUpdateUsersList(updated);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="welcome-card admin-banner">
        <div className="welcome-content">
          <span className="badge badge-purple">⚙️ {t('adminTitle')}</span>
          <h1>Welcome, {adminUser.name}! 👋</h1>
          <p className="welcome-sub">{adminUser.department} • {t('adminSub')}</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon icon-teal">👤</div>
          <div className="metric-info">
            <span className="metric-label">{t('totalPatients')}</span>
            <div className="metric-value text-teal">{patientCount} Patients</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-amber">🏠</div>
          <div className="metric-info">
            <span className="metric-label">{t('totalCaregivers')}</span>
            <div className="metric-value text-amber">{caregiverCount} Caregivers</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-blue">🩺</div>
          <div className="metric-info">
            <span className="metric-label">{t('totalPhysios')}</span>
            <div className="metric-value text-blue">{physioCount} Therapists</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-emerald">⚡</div>
          <div className="metric-info">
            <span className="metric-label">{t('activeUsers')}</span>
            <div className="metric-value text-emerald">{usersList.length} Accounts</div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="table-card mt-24">
        <div className="table-header">
          <div>
            <h3>{t('userManagementTitle')}</h3>
            <p className="table-sub">View and modify system access accounts</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            {t('addUserBtn')}
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('colName')}</th>
                <th>{t('colEmail')}</th>
                <th>{t('colRole')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td className="font-mono">{u.email}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'patient' ? 'badge-teal' :
                      u.role === 'caregiver' ? 'badge-blue' :
                      u.role === 'physiotherapist' ? 'badge-purple' : 'badge-outline'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-emerald' : 'badge-outline'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-xs ${u.status === 'Active' ? 'btn-amber' : 'btn-emerald'}`}
                      onClick={() => handleToggleStatus(u.id)}
                    >
                      {u.status === 'Active' ? t('deactivateUser') : t('activateUser')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('addUserBtn')}</h3>
              <p>Register a new system user for Dextra platform</p>
            </div>

            <form onSubmit={handleAddUser} className="login-form">
              <div className="form-group">
                <label>{t('colName')}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('colEmail')}</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@dextra.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('colRole')}</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="patient">Patient</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="physiotherapist">Physiotherapist</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('password')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-row mt-16">
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowAddModal(false)}>
                  {t('cancelBtn')}
                </button>
                <button type="submit" className="btn btn-emerald flex-1">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
