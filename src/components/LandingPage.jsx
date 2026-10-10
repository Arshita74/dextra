import React from 'react';
import { ShieldCheck, Cpu, Activity, Globe, ArrowRight, Zap, Play } from 'lucide-react';
import HandOrthosis3D from './HandOrthosis3D';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function LandingPage({ onLoginClick, onRegisterClick, onDemoClick, lang = 'en' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between backdrop-blur sticky top-0 z-50 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            🦾
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white">DEXTRA</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            {t('landingLoginBtn')}
          </button>
          <button
            onClick={onDemoClick}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-600/30 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            {t('landingTryDemoBtn')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            IoT Rehabilitation & Assistive Technology Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            {t('landingHeroTitle')}
          </h1>

          <p className="text-base text-slate-400 leading-relaxed max-w-xl">
            {t('landingHeroSub')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onDemoClick}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white font-bold rounded-2xl text-sm shadow-xl shadow-teal-500/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Live Application
            </button>

            <button
              onClick={onLoginClick}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-2xl text-sm border border-slate-800 flex items-center gap-2 transition"
            >
              Sign In to Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Visualizer Canvas Preview */}
        <div className="w-full">
          <HandOrthosis3D isAnimating={true} height="380px" />
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="px-6 py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('keyFeaturesTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Designed specifically to bridge hardware actuation with rehabilitation telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('featSwitchControl')}</h3>
              <p className="text-xs text-slate-400">{t('featSwitchControlDesc')}</p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-sky-500/50 transition">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('featIotTelemetry')}</h3>
              <p className="text-xs text-slate-400">{t('featIotTelemetryDesc')}</p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('featVisualizer')}</h3>
              <p className="text-xs text-slate-400">{t('featVisualizerDesc')}</p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('featAnalytics')}</h3>
              <p className="text-xs text-slate-400">{t('featAnalyticsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Flow Diagram */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('architectureTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-400">Complete end-to-end hardware & web software pipeline</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: "1", title: t('archUser'), desc: "Switch trigger" },
            { step: "2", title: t('archWebApp'), desc: "React Dashboard" },
            { step: "3", title: t('archBackend'), desc: "FastAPI Service" },
            { step: "4", title: t('archEsp32'), desc: "Wi-Fi Telemetry" },
            { step: "5", title: t('archServos'), desc: "2× MG90S PWM" },
            { step: "6", title: t('archOrthosis'), desc: "Hand Flexion" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center mb-2">
                {item.step}
              </span>
              <div className="text-xs font-bold text-white mb-1">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility Statement Footer */}
      <footer className="px-6 py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          {t('accessibilityTitle')}
        </div>
        <p className="max-w-xl mx-auto text-slate-500 text-[11px]">
          {t('accessibilityDesc')}
        </p>
        <p className="text-[10px] text-slate-600 pt-2 font-mono">
          © 2026 DEXTRA Orthosis Platform — Academic & Assistive Technology Project.
        </p>
      </footer>
    </div>
  );
}
