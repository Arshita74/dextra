import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import NotificationBanner from './components/NotificationBanner';
import PatientDashboard from './pages/PatientDashboard';
import ExercisesPage from './pages/ExercisesPage';
import SessionPage from './pages/SessionPage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import AchievementsPage from './pages/AchievementsPage';
import DevicePage from './pages/DevicePage';
import PatientProfilePage from './pages/PatientProfilePage';
import SettingsPage from './pages/SettingsPage';
import CaregiverDashboard from './pages/CaregiverDashboard';
import PhysioDashboard from './pages/PhysioDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HelpPage from './pages/HelpPage';

import {
  DEMO_USERS,
  CORE_EXERCISES,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLETED_SESSIONS,
} from './data/mockData';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('dextra_logged_in') === 'true';
  });

  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'signup'

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dextra_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  // System Users List State
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('dextra_users_list');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  // Language State: 'en' | 'te' | 'hi'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('dextra_lang') || 'en';
  });

  // Accessibility States
  const [fontSizeScale, setFontSizeScale] = useState(() => {
    return localStorage.getItem('dextra_font_scale') || 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('dextra_high_contrast') === 'true';
  });

  // Active Navigation Tab State
  const [activeTab, setActiveTabState] = useState(() => {
    const savedUser = localStorage.getItem('dextra_current_user');
    const user = savedUser ? JSON.parse(savedUser) : DEMO_USERS[0];
    if (user?.role === 'caregiver') return 'caregiver';
    if (user?.role === 'physiotherapist') return 'physio';
    if (user?.role === 'administrator') return 'admin';
    return 'dashboard';
  });

  // Access Denied State
  const [accessDeniedMsg, setAccessDeniedMsg] = useState('');

  // Exercises & Active Session State
  const [exercises] = useState(CORE_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Completed Sessions History
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('dextra_sessions');
    return saved ? JSON.parse(saved) : INITIAL_COMPLETED_SESSIONS;
  });

  // Notifications State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('dextra_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('dextra_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dextra_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('dextra_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('dextra_font_scale', fontSizeScale);
    document.body.classList.remove('font-large', 'font-xlarge');
    if (fontSizeScale === 'large') document.body.classList.add('font-large');
    if (fontSizeScale === 'xlarge') document.body.classList.add('font-xlarge');
  }, [fontSizeScale]);

  useEffect(() => {
    localStorage.setItem('dextra_high_contrast', highContrast);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('dextra_sessions', JSON.stringify(completedSessions));
  }, [completedSessions]);

  // Route Protection Guard
  const setActiveTab = (tab) => {
    const role = currentUser?.role;

    if (tab === 'admin' && role !== 'administrator') {
      setAccessDeniedMsg(`Access Denied: Administrator role required.`);
      setTimeout(() => setAccessDeniedMsg(''), 4000);
      return;
    }

    if (tab === 'physio' && role !== 'physiotherapist' && role !== 'administrator') {
      setAccessDeniedMsg(`Access Denied: Physiotherapist role required.`);
      setTimeout(() => setAccessDeniedMsg(''), 4000);
      return;
    }

    if (tab === 'caregiver' && role !== 'caregiver' && role !== 'administrator') {
      setAccessDeniedMsg(`Access Denied: Caregiver role required.`);
      setTimeout(() => setAccessDeniedMsg(''), 4000);
      return;
    }

    setActiveTabState(tab);
  };

  // Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setAccessDeniedMsg('');
    if (user.role === 'caregiver') setActiveTabState('caregiver');
    else if (user.role === 'physiotherapist') setActiveTabState('physio');
    else if (user.role === 'administrator') setActiveTabState('admin');
    else setActiveTabState('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('landing');
    setActiveTabState('dashboard');
  };

  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise);
    setActiveTabState('session');
  };

  const handleCompleteSession = (sessionData) => {
    const newSession = {
      id: `sess-${Date.now()}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...sessionData,
    };

    setCompletedSessions((prev) => [newSession, ...prev]);

    const updatedUser = {
      ...currentUser,
      completedTodayCount: (currentUser.completedTodayCount || 0) + 1,
      streakDays: (currentUser.streakDays || 1) + 1,
      overallProgressPercent: Math.min(100, (currentUser.overallProgressPercent || 50) + 5),
    };

    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedExercise(null);
    setActiveTabState('dashboard');

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        text: `Completed exercise: ${sessionData.exerciseName}`,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleCancelSession = () => {
    setSelectedExercise(null);
    setActiveTabState('exercises');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser(updatedProfile);
    setUsersList((prev) => prev.map((u) => (u.id === updatedProfile.id ? updatedProfile : u)));
  };

  // Unauthenticated Views: Landing, Login, Signup
  if (!isLoggedIn) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onLoginClick={() => setAuthView('login')}
          onRegisterClick={() => setAuthView('signup')}
          onDemoClick={() => {
            handleLogin(DEMO_USERS[0]);
          }}
          lang={lang}
        />
      );
    }

    if (authView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={(newUser) => {
            setUsersList((prev) => [...prev, newUser]);
            handleLogin(newUser);
          }}
          onBackToLogin={() => setAuthView('login')}
          lang={lang}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onRegisterClick={() => setAuthView('signup')}
        lang={lang}
        onChangeLanguage={setLang}
        demoUsers={usersList}
      />
    );
  }

  // Authenticated Layout Application Shell
  return (
    <Layout
      user={currentUser}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      lang={lang}
      onChangeLanguage={setLang}
      fontSizeScale={fontSizeScale}
      onChangeFontSize={setFontSizeScale}
      highContrast={highContrast}
      onToggleHighContrast={() => setHighContrast(!highContrast)}
      onLogout={handleLogout}
    >
      {/* Access Denied Alert Banner */}
      {accessDeniedMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs font-semibold mb-4">
          ⛔ {accessDeniedMsg}
        </div>
      )}

      {/* Notifications */}
      <NotificationBanner notifications={notifications} />

      {/* Tab Router Views */}
      {activeTab === 'dashboard' && (
        <PatientDashboard
          patientUser={currentUser}
          exercises={exercises}
          onStartExercise={handleStartExercise}
          onViewAllExercises={() => setActiveTab('exercises')}
          onViewProgress={() => setActiveTab('progress')}
          lang={lang}
          isDeviceConnected={true}
        />
      )}

      {activeTab === 'exercises' && (
        <ExercisesPage
          exercises={exercises}
          onStartExercise={handleStartExercise}
          lang={lang}
        />
      )}

      {activeTab === 'session' && (
        <SessionPage
          exercise={selectedExercise || exercises[0]}
          patientUser={currentUser}
          onCompleteSession={handleCompleteSession}
          onCancelSession={handleCancelSession}
          lang={lang}
        />
      )}

      {activeTab === 'progress' && (
        <ProgressPage
          completedSessions={completedSessions}
          patientUser={currentUser}
          onStartNewExercise={() => setActiveTab('exercises')}
          lang={lang}
        />
      )}

      {activeTab === 'history' && (
        <HistoryPage
          completedSessions={completedSessions}
          lang={lang}
        />
      )}

      {activeTab === 'achievements' && (
        <AchievementsPage
          patientUser={currentUser}
          completedSessions={completedSessions}
          lang={lang}
        />
      )}

      {activeTab === 'device' && (
        <DevicePage
          lang={lang}
          userId={currentUser.id}
        />
      )}

      {activeTab === 'profile' && (
        <PatientProfilePage
          user={currentUser}
          onUpdateUser={handleUpdateProfile}
          lang={lang}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPage
          lang={lang}
          onChangeLanguage={setLang}
          fontSizeScale={fontSizeScale}
          onChangeFontSize={setFontSizeScale}
          highContrast={highContrast}
          onToggleHighContrast={() => setHighContrast(!highContrast)}
        />
      )}

      {/* Role Portals */}
      {activeTab === 'caregiver' && (
        <CaregiverDashboard
          caregiverUser={currentUser}
          patientUser={usersList.find((u) => u.id === currentUser.linkedPatientId) || usersList.find((u) => u.role === 'patient')}
          completedSessions={completedSessions}
          lang={lang}
        />
      )}

      {activeTab === 'physio' && (
        <PhysioDashboard
          physioUser={currentUser}
          patientsList={usersList.filter((u) => u.role === 'patient')}
          exercisesList={exercises}
          completedSessions={completedSessions}
          lang={lang}
        />
      )}

      {activeTab === 'admin' && (
        <AdminDashboard
          adminUser={currentUser}
          usersList={usersList}
          onUpdateUsersList={setUsersList}
          lang={lang}
        />
      )}

      {activeTab === 'help' && <HelpPage lang={lang} />}
    </Layout>
  );
}
