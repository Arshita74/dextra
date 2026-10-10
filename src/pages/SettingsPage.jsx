import React, { useState } from 'react';
import { Settings, Globe, Eye, Type, Bell, Save, CheckCircle } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function SettingsPage({
  lang = 'en',
  onChangeLanguage,
  fontSizeScale,
  onChangeFontSize,
  highContrast,
  onToggleHighContrast
}) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = () => {
    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-teal-500" />
            {t('settingsTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize language, font sizing, and visual contrast preferences.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {savedMsg}
        </div>
      )}

      {/* Settings Form Sections */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 space-y-6 shadow-sm">
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{t('languageLabel')}</div>
              <div className="text-xs text-slate-400">Select interface display language</div>
            </div>
          </div>

          <select
            value={lang}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          >
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Text Scaling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{t('textSizeLabel')}</div>
              <div className="text-xs text-slate-400">Adjust readability font scale</div>
            </div>
          </div>

          <div className="flex gap-2">
            {['normal', 'large', 'xlarge'].map((scale) => (
              <button
                key={scale}
                onClick={() => onChangeFontSize(scale)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  fontSizeScale === scale
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{t('highContrastLabel')}</div>
              <div className="text-xs text-slate-400">Enhance visual contrast for readability</div>
            </div>
          </div>

          <button
            onClick={onToggleHighContrast}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              highContrast ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              highContrast ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          {t('saveSettingsBtn')}
        </button>
      </div>
    </div>
  );
}
