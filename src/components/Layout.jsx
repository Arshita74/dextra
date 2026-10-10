import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  History,
  Trophy,
  Cpu,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  Sun,
  Moon,
  Eye,
  Type,
  Menu,
  X
} from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function Layout({
  children,
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
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'exercises', label: t('navExercises'), icon: Activity },
    { id: 'progress', label: t('navProgress'), icon: BarChart3 },
    { id: 'history', label: t('navHistory'), icon: History },
    { id: 'achievements', label: t('navAchievements'), icon: Trophy },
    { id: 'device', label: t('navDevice'), icon: Cpu },
    { id: 'profile', label: t('navProfile'), icon: User },
    { id: 'settings', label: t('navSettings'), icon: Settings },
    { id: 'help', label: t('navHelp'), icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700/80 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              🦾
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white tracking-wider text-base flex items-center gap-1.5">
                {t('brandName')}
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                  Smart Orthosis
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('brandSubtitle')}
              </div>
            </div>
          </div>
        </div>

        {/* Header Controls: Language, Accessibility, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-semibold">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <select
              value={lang}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="en" className="dark:bg-slate-800">English</option>
              <option value="te" className="dark:bg-slate-800">తెలుగు (Telugu)</option>
              <option value="hi" className="dark:bg-slate-800">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* High Contrast Mode Quick Toggle */}
          <button
            onClick={onToggleHighContrast}
            title={t('highContrastLabel')}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center transition ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* User Profile Info */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-teal-400">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono capitalize">{user.role || 'Patient'}</div>
              </div>
              <button
                onClick={onLogout}
                title={t('navLogout')}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container with Desktop Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/80 p-4 justify-between">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Hardware Status Footer Badge */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>ESP32 Telemetry</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              IP: 192.168.1.100 | Port 8000
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs bg-white dark:bg-slate-800 h-full p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-teal-600 dark:text-teal-400 text-base">{t('brandName')}</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                {t('navLogout')}
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Responsive Bottom Navigation */}
      <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-800/95 backdrop-blur px-2 py-1.5 flex justify-around sticky bottom-0 z-30">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium ${
                isActive ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
