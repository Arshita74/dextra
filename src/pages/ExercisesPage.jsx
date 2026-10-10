import React from 'react';
import { Activity, Play, Cpu, Info } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function ExercisesPage({ exercises = [], onStartExercise, lang = 'en' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('exerciseCatalogueTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('exerciseCatalogueSub')}
          </p>
        </div>

        <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          <span>Physical Orthosis Prototype: Dual MG90S Servos</span>
        </div>
      </div>

      {/* Hardware Constraint Banner Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Hardware Actuation Notice</span>
          Exercises tagged with <strong className="text-teal-700 dark:text-teal-300 font-mono">🟢 Hardware Actuated (2× Servos)</strong> are physically powered by the ESP32 prototype. Exercises tagged with <strong className="text-sky-700 dark:text-sky-300 font-mono">🔵 Guided Software Protocol</strong> provide visual guidance and repetition tracking.
        </div>
      </div>

      {/* Exercises Catalogue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => {
          const isHardwareActuated = ex.id === 'ex-wrist-flexion' || ex.id === 'ex-wrist-extension' || ex.id === 'ex-grip-release';
          return (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm flex flex-col justify-between hover:border-teal-500/50 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isHardwareActuated
                      ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800'
                      : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800'
                  }`}>
                    {isHardwareActuated ? t('hardwareSupportedBadge') : t('softwareGuidedBadge')}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{ex.durationSec || 60}s</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  {ex.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ex.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">{t('targetRepsLabel')}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ex.targetReps || 10} reps</span>
                </div>

                <button
                  onClick={() => onStartExercise(ex)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {t('startSessionBtn')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
