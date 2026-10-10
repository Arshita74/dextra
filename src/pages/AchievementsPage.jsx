import React from 'react';
import { Trophy, Award, Flame, Star, Lock, CheckCircle2 } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function AchievementsPage({ patientUser, completedSessions = [], lang = 'en' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const totalSessionsCount = completedSessions.length || (patientUser?.completedTodayCount ? 1 : 0);
  const totalRepsSum = completedSessions.reduce((acc, s) => acc + (s.totalReps || 0), 0) || (totalSessionsCount * 10);
  const streakDays = patientUser?.streakDays || 1;

  const achievementsList = [
    {
      id: 'ach-first',
      title: t('achFirstSession'),
      desc: t('achFirstSessionDesc'),
      icon: Trophy,
      unlocked: totalSessionsCount >= 1
    },
    {
      id: 'ach-10reps',
      title: t('achReps10'),
      desc: t('achReps10Desc'),
      icon: Award,
      unlocked: totalRepsSum >= 10
    },
    {
      id: 'ach-50reps',
      title: t('achReps50'),
      desc: t('achReps50Desc'),
      icon: Flame,
      unlocked: totalRepsSum >= 50
    },
    {
      id: 'ach-streak',
      title: t('achStreak3'),
      desc: t('achStreak3Desc'),
      icon: Star,
      unlocked: streakDays >= 3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            {t('achievementsTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('achievementsSub')}
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-mono font-bold">
          Unlocked: {achievementsList.filter((a) => a.unlocked).length} / {achievementsList.length}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievementsList.map((ach) => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl border flex items-start gap-4 transition ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-800/60 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className={`p-3.5 rounded-2xl shrink-0 ${
                ach.unlocked ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                <Icon className="w-7 h-7" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{ach.title}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    ach.unlocked
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {ach.unlocked ? t('unlockedStatus') : t('lockedStatus')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
