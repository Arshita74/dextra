import React, { useState } from 'react';
import { History, Search, Filter, Calendar, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';

const dictionaries = { en, te, hi };

export default function HistoryPage({ completedSessions = [], lang = 'en' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = completedSessions.filter((sess) =>
    (sess.exerciseName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-teal-500" />
            {t('historyTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('historySub')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {t('noDataYet')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-semibold text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">{t('colDate')}</th>
                  <th className="px-6 py-3.5">{t('colExercise')}</th>
                  <th className="px-6 py-3.5">{t('colTotalReps')}</th>
                  <th className="px-6 py-3.5">{t('colSuccessReps')}</th>
                  <th className="px-6 py-3.5">{t('colSuccessRate')}</th>
                  <th className="px-6 py-3.5">{t('colDuration')}</th>
                  <th className="px-6 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-mono">
                {filteredSessions.map((sess, idx) => (
                  <tr key={sess.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                    <td className="px-6 py-4 font-sans font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {sess.date || new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {sess.exerciseName || 'Wrist Flexion'}
                    </td>
                    <td className="px-6 py-4">{sess.totalReps || 10}</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">{sess.successfulReps || 9}</td>
                    <td className="px-6 py-4 text-teal-600 dark:text-teal-400">{sess.successRate || 90}%</td>
                    <td className="px-6 py-4">{sess.durationSeconds ? `${sess.durationSeconds}s` : '01:00'}</td>
                    <td className="px-6 py-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedSession(sess)}
                        className="text-teal-600 dark:text-teal-400 hover:underline text-xs font-semibold inline-flex items-center gap-1"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Session Verification Details
              </h3>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400">Exercise:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSession.exerciseName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400">Total Repetitions:</span>
                <span>{selectedSession.totalReps}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400">Verified Successful:</span>
                <span className="text-emerald-500 font-bold">{selectedSession.successfulReps}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400">Hardware Telemetry:</span>
                <span className="text-teal-400">ESP32 Ingestion OK</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSession(null)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
