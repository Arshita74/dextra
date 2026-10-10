import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle, ArrowLeft, Cpu, Activity, Sparkles } from 'lucide-react';
import HandOrthosis3D from '../components/HandOrthosis3D';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';
import { apiService } from '../services/api';

const dictionaries = { en, te, hi };

export default function SessionPage({
  exercise,
  patientUser,
  onCompleteSession,
  onCancelSession,
  lang = 'en'
}) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const exName = exercise?.name || 'Wrist Flexion & Extension';
  const targetReps = exercise?.targetReps || 10;
  const targetTime = exercise?.durationSec || 60;

  const [currentReps, setCurrentReps] = useState(0);
  const [successfulReps, setSuccessfulReps] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(targetTime);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [repFlash, setRepFlash] = useState(0);

  // Live Timer Countdown Loop
  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  // Simulate or Ingest Hardware Rep Trigger
  const handleHardwareRepTrigger = () => {
    if (currentReps < targetReps) {
      const nextCount = currentReps + 1;
      const nextSuccess = successfulReps + 1;
      setCurrentReps(nextCount);
      setSuccessfulReps(nextSuccess);
      setRepFlash(Date.now());

      if (nextCount >= targetReps) {
        setIsActive(false);
        handleFinishSession(nextCount, nextSuccess);
      }
    }
  };

  const handleFinishSession = async (finalReps = currentReps, finalSuccess = successfulReps) => {
    setIsCompleted(true);
    const duration = targetTime - secondsRemaining;

    const sessionPayload = {
      user_id: patientUser?.id || 'usr-patient',
      exercise_id: exercise?.id || 'ex-wrist-flexion',
      exercise_name: exName,
      total_reps: finalReps,
      successful_reps: finalSuccess,
      target_reps: targetReps,
      duration_seconds: duration
    };

    await apiService.recordSession(sessionPayload);
  };

  const handleCompleteButtonClick = () => {
    onCompleteSession({
      exerciseName: exName,
      totalReps: currentReps,
      successfulReps: successfulReps,
      durationSeconds: targetTime - secondsRemaining,
      successRate: currentReps > 0 ? Math.round((successfulReps / currentReps) * 100) : 100
    });
  };

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isCompleted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/80 shadow-xl max-w-xl mx-auto text-center space-y-6 my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('sessionCompletedTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('sessionCompletedMsg')}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 font-mono text-xs">
          <div>
            <div className="text-slate-400 text-[10px]">Reps Completed</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{currentReps}/{targetReps}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Success Rate</div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {currentReps > 0 ? Math.round((successfulReps / currentReps) * 100) : 100}%
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Time</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(targetTime - secondsRemaining)}</div>
          </div>
        </div>

        <button
          onClick={handleCompleteButtonClick}
          className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-teal-600/30 transition"
        >
          {t('returnDashboardBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelSession}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" />
              {exName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Target: {targetReps} repetitions | Time: {formatTime(targetTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hidden sm:inline">
            ESP32 Telemetry Ready
          </span>
        </div>
      </div>

      {/* Main Grid: 3D Visualization + Live Counters & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Live 3D Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <HandOrthosis3D
            isAnimating={isActive}
            repTrigger={repFlash}
            isConnected={true}
            height="360px"
          />

          {/* Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">{t('sessionProgress')}</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono">
                {Math.round((currentReps / targetReps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-sky-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentReps / targetReps) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Rep Counter, Timer, Hardware Buttons */}
        <div className="space-y-6">
          {/* Counters Grid */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6 text-center">
            {/* Rep Counter Display */}
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold mb-1">{t('currentReps')}</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {currentReps < 10 ? `0${currentReps}` : currentReps}
                <span className="text-xl text-slate-400 font-normal"> / {targetReps}</span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] text-slate-400 uppercase font-semibold mb-0.5">{t('timer')}</div>
              <div className="text-3xl font-bold font-mono text-teal-600 dark:text-teal-400">
                {formatTime(secondsRemaining)}
              </div>
            </div>

            {/* Live Hardware Control Buttons */}
            <div className="space-y-2">
              {!isActive ? (
                <button
                  onClick={() => setIsActive(true)}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t('startBtn')}
                </button>
              ) : (
                <button
                  onClick={() => setIsActive(false)}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  {t('pauseBtn')}
                </button>
              )}

              {/* Hardware Interrupt Trigger Simulation Button */}
              <button
                onClick={handleHardwareRepTrigger}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-slate-200 dark:border-slate-600"
              >
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                Simulate Push-Button Rep
              </button>

              <button
                onClick={() => handleFinishSession()}
                className="w-full py-2.5 text-rose-600 dark:text-rose-400 hover:underline text-xs font-semibold"
              >
                {t('endSessionBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
