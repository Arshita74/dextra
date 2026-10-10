import React from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Radio,
  Sparkles
} from 'lucide-react';
import HandOrthosis3D from '../components/HandOrthosis3D';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function PatientDashboard({
  patientUser,
  exercises = [],
  onStartExercise,
  onViewAllExercises,
  onViewProgress,
  lang = 'en',
  isDeviceConnected = true
}) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const todayCount = patientUser?.completedTodayCount || 0;
  const streakDays = patientUser?.streakDays || 1;
  const currentEx = exercises[0] || { name: 'Wrist Flexion & Extension', targetReps: 10 };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-radial from-teal-400 via-sky-500 to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Connection Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-xs font-mono font-medium backdrop-blur">
              <span className={`w-2.5 h-2.5 rounded-full ${isDeviceConnected ? 'bg-emerald-400 animate-pulse-glow' : 'bg-rose-500'}`} />
              <span className={isDeviceConnected ? 'text-emerald-400' : 'text-rose-400'}>
                {isDeviceConnected ? '🟢 ESP32 TELEMETRY ONLINE (Mesh Connected)' : t('deviceOfflineStatus')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('welcomeGreeting')}, {patientUser?.name?.split(' ')[0] || 'Lakshmi'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t('readyPrompt')} Your prescribed motor therapy is active.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onStartExercise(currentEx)}
            className="px-7 py-4 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            {t('startTodayExerciseBtn')}
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Today's Reps */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm pro-glow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t('todayReps')}</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {todayCount * 10}
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Target: 20 reps</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Successful Reps */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm pro-glow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t('successfulReps')}</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {Math.round(todayCount * 9)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Verified by Servos
            </div>
          </div>
        </div>

        {/* Stat 3: Success Rate */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm pro-glow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t('successRate')}</span>
            <div className="p-2 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {todayCount > 0 ? '90%' : '0%'}
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-1">
              Controlled flexion
            </div>
          </div>
        </div>

        {/* Stat 4: Session Duration */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm pro-glow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t('sessionDuration')}</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {todayCount > 0 ? '04:30' : '00:00'}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Streak: {streakDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Preview Canvas + Today's Exercise & Hardware Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): 3D Orthosis Telemetry & Goal Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live 3D Hand Orthosis Monitor */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-400" />
                {t('live3dPreview')}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                ESP32 ➔ Dual MG90S Servos
              </span>
            </div>

            <HandOrthosis3D isAnimating={isDeviceConnected} height="300px" />
          </div>

          {/* Today's Goal & Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('rehabGoal')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prescribed by Dr. Ananya Rao</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                {todayCount}/2 Sessions
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayCount / 2) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>0%</span>
                <span>{Math.min(100, (todayCount / 2) * 100)}% Complete</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Recommended Exercise Card & Latest Event */}
        <div className="space-y-6">
          {/* Current Recommended Exercise */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500" />
                Prescribed Exercise
              </h3>
              <button
                onClick={onViewAllExercises}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">
                  🟢 Hardware Actuated (2× Servos)
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Wrist Flexion & Extension
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  Controlled motor assistance restoring upward and downward wrist joint mobility.
                </p>
              </div>

              <button
                onClick={() => onStartExercise(currentEx)}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Play className="w-4 h-4 fill-white" />
                {t('startExerciseBtn')}
              </button>
            </div>
          </div>

          {/* Latest Telemetry Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
                {t('latestHardwareEvent')}
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                LIVE SYNC
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Event:</span>
                <span className="text-teal-400 font-bold">BUTTON_PRESS</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Servo 1 Angle:</span>
                <span className="text-sky-400 font-bold">145°</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Servo 2 Angle:</span>
                <span className="text-sky-400 font-bold">145°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
