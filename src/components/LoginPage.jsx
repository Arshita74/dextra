import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, KeyRound, Globe, UserCheck, Sparkles } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';
import ForgotPasswordModal from './ForgotPasswordModal';

const dictionaries = { en, te, hi };

export default function LoginPage({ onLogin, onRegisterClick, lang = 'en', onChangeLanguage, demoUsers = [] }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const matchedUser = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'patient'
    };

    onLogin(matchedUser, true);
  };

  const handleQuickDemoSelect = (user) => {
    onLogin(user, true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
            🦾
          </div>
          <span className="font-black text-white text-lg tracking-wider">DEXTRA</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <select
            value={lang}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="te" className="bg-slate-900">తెలుగు</option>
            <option value="hi" className="bg-slate-900">हिन्दी</option>
          </select>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">{t('loginTitle')}</h2>
          <p className="text-xs text-slate-400">{t('loginSubtitle')}</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">{t('emailOrUsername')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lakshmi@dextra.org"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">{t('password')}</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-teal-400 hover:underline"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-600/30 transition"
          >
            {t('signInButton')}
          </button>
        </form>

        {/* 1-Click Demo Accounts Section */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('quickDemoLogin')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {demoUsers.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickDemoSelect(u)}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left transition space-y-0.5"
              >
                <div className="font-bold text-white text-[11px] truncate">{u.name}</div>
                <div className="text-[10px] text-teal-400 font-mono capitalize">{u.role}</div>
              </button>
            ))}
          </div>
        </div>

        {onRegisterClick && (
          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">{t('dontHaveAccount')} </span>
            <button
              onClick={onRegisterClick}
              className="text-xs text-teal-400 font-semibold hover:underline"
            >
              {t('signUpButton')}
            </button>
          </div>
        )}
      </div>

      <footer className="text-center text-[11px] text-slate-600 py-2">
        DEXTRA Orthosis Assistive Technology System © 2026
      </footer>

      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
