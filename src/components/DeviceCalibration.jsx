import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, RefreshCw, Save } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';
import { apiService } from '../services/api';

const dictionaries = { en, te, hi };

export default function DeviceCalibration({ lang = 'en', userId = 'usr-patient' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const [calibration, setCalibration] = useState({
    servo1_neutral: 90,
    servo1_min: 15,
    servo1_max: 165,
    servo2_neutral: 90,
    servo2_min: 15,
    servo2_max: 165,
    intensity: 'MODERATE'
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [testingSweep, setTestingSweep] = useState(false);

  useEffect(() => {
    async function loadCal() {
      const data = await apiService.getCalibration(userId);
      if (data) setCalibration(data);
    }
    loadCal();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    await apiService.saveCalibration({ user_id: userId, ...calibration });
    setSaving(false);
    setSuccessMsg(t('calibrationNotice') || 'Calibration saved successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleTestSweep = () => {
    setTestingSweep(true);
    setTimeout(() => setTestingSweep(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
          <Sliders className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('calibrationTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('calibrationSub')}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Servo 1: Wrist Joint Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
            <span>🦾 Servo 1 — Wrist Joint Servo</span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-normal">MG90S Pin 18</span>
          </h4>
          
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('servo1Neutral')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{calibration.servo1_neutral}°</span>
              </div>
              <input 
                type="range" min="0" max="180" 
                value={calibration.servo1_neutral} 
                onChange={(e) => setCalibration({...calibration, servo1_neutral: parseInt(e.target.value)})} 
                className="w-full accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">{t('servo1Min')}</label>
                <input 
                  type="number" min="0" max="90" 
                  value={calibration.servo1_min} 
                  onChange={(e) => setCalibration({...calibration, servo1_min: parseInt(e.target.value)})}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">{t('servo1Max')}</label>
                <input 
                  type="number" min="90" max="180" 
                  value={calibration.servo1_max} 
                  onChange={(e) => setCalibration({...calibration, servo1_max: parseInt(e.target.value)})}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Servo 2: Finger Assist Servo */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
            <span>🖐️ Servo 2 — Finger Assist Servo</span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-normal">MG90S Pin 19</span>
          </h4>
          
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('servo2Neutral')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{calibration.servo2_neutral}°</span>
              </div>
              <input 
                type="range" min="0" max="180" 
                value={calibration.servo2_neutral} 
                onChange={(e) => setCalibration({...calibration, servo2_neutral: parseInt(e.target.value)})} 
                className="w-full accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">{t('servo2Min')}</label>
                <input 
                  type="number" min="0" max="90" 
                  value={calibration.servo2_min} 
                  onChange={(e) => setCalibration({...calibration, servo2_min: parseInt(e.target.value)})}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">{t('servo2Max')}</label>
                <input 
                  type="number" min="90" max="180" 
                  value={calibration.servo2_max} 
                  onChange={(e) => setCalibration({...calibration, servo2_max: parseInt(e.target.value)})}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleTestSweep}
          disabled={testingSweep}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingSweep ? 'animate-spin text-teal-500' : ''}`} />
          {testingSweep ? 'Testing Servos...' : t('testCalibrationBtn')}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : t('saveCalibrationBtn')}
        </button>
      </div>
    </div>
  );
}
