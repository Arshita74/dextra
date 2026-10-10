import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Radio, Sliders, RefreshCw, CheckCircle2, Server, ArrowRight } from 'lucide-react';
import HardwareSimulator from '../components/HardwareSimulator';
import DeviceCalibration from '../components/DeviceCalibration';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';
import { apiService } from '../services/api';

const dictionaries = { en, te, hi };

export default function DevicePage({ lang = 'en', userId = 'usr-patient' }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const [deviceStatus, setDeviceStatus] = useState({
    status: 'CONNECTED',
    device_id: 'ESP32-DEXTRA-01',
    wifi_status: 'Connected (Mesh)',
    servo1_angle: 90,
    servo2_angle: 90,
    button_state: 'RELEASED',
    last_sync: 'Just now'
  });

  const [isConnected, setIsConnected] = useState(true);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'simulator' | 'calibration'

  useEffect(() => {
    async function loadTelemetry() {
      const data = await apiService.getDeviceStatus();
      if (data) setDeviceStatus(data);
    }
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-teal-500" />
            {t('deviceMonitorTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, calibration, and simulator controls for ESP32 Orthosis prototype.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'telemetry' ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'simulator' ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Simulator Bench
          </button>
          <button
            onClick={() => setActiveTab('calibration')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'calibration' ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Calibration
          </button>
        </div>
      </div>

      {activeTab === 'telemetry' && (
        <>
          {/* Telemetry Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ESP32 Controller */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{t('esp32Controller')}</span>
                <Cpu className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {deviceStatus.device_id}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Status: Online</div>
            </div>

            {/* Wi-Fi Status */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{t('wifiConnection')}</span>
                <Wifi className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono truncate">
                {deviceStatus.wifi_status}
              </div>
              <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">HTTP Telemetry Active</div>
            </div>

            {/* Servo Motors */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Dual Servos (MG90S)</span>
                <Sliders className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                S1: {deviceStatus.servo1_angle || 90}° | S2: {deviceStatus.servo2_angle || 90}°
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">PWM Pins 18 & 19</div>
            </div>

            {/* Push Button Interrupt */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{t('pushButtonStatus')}</span>
                <Radio className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {deviceStatus.button_state || 'RELEASED'}
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Interrupt GPIO Pin 4</div>
            </div>
          </div>

          {/* Hardware Communication Architecture Diagram */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                {t('hardwareDiagramTitle')}
              </h3>
              <p className="text-xs text-slate-400">Complete physical communication pipeline from Web Client to Orthosis Brace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              {[
                { title: "Dextra Web App", desc: "React Dashboard", bg: "bg-slate-800" },
                { title: "FastAPI Backend", desc: "Python /api/ingest", bg: "bg-slate-800" },
                { title: "ESP32 Board", desc: "Wi-Fi Telemetry", bg: "bg-teal-950 border-teal-500/40" },
                { title: "Dual MG90S Servos", desc: "PWM Motion Sweep", bg: "bg-slate-800" },
                { title: "Orthosis Glove", desc: "Finger Flexion", bg: "bg-slate-800" },
              ].map((node, i) => (
                <div key={i} className={`p-4 rounded-2xl border border-slate-700 ${node.bg} space-y-1 flex flex-col justify-center items-center`}>
                  <div className="text-xs font-bold text-white">{node.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{node.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'simulator' && (
        <HardwareSimulator
          lang={lang}
          isConnected={isConnected}
          onToggleConnection={() => setIsConnected(!isConnected)}
        />
      )}

      {activeTab === 'calibration' && (
        <DeviceCalibration lang={lang} userId={userId} />
      )}
    </div>
  );
}
