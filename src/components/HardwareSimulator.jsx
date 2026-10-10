import React, { useState } from 'react';
import { Cpu, Radio, ToggleLeft, ToggleRight, PlayCircle, Activity } from 'lucide-react';
import { en } from '../translations/en';
import { te } from '../translations/te';
import { hi } from '../translations/hi';
import { apiService } from '../services/api';

const dictionaries = { en, te, hi };

export default function HardwareSimulator({ lang = 'en', onTriggerRep, isConnected = true, onToggleConnection }) {
  const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;

  const [simulatingRep, setSimulatingRep] = useState(false);
  const [simulatingSweep, setSimulatingSweep] = useState(false);
  const [servoAngle, setServoAngle] = useState(90);

  const handleSimulateButtonPress = async () => {
    setSimulatingRep(true);
    await apiService.ingestEvent({
      device_id: "ESP32-SIMULATED-01",
      event_type: "BUTTON_PRESS",
      servo1_angle: 145,
      servo2_angle: 145,
      button_state: "PRESSED"
    });

    if (onTriggerRep) onTriggerRep();

    setTimeout(() => {
      setSimulatingRep(false);
    }, 600);
  };

  const handleSimulateServoSweep = async () => {
    setSimulatingSweep(true);
    let current = 15;
    const interval = setInterval(async () => {
      current += 30;
      setServoAngle(current);
      if (current >= 165) {
        clearInterval(interval);
        setServoAngle(90);
        setSimulatingSweep(false);
      }
      await apiService.ingestEvent({
        device_id: "ESP32-SIMULATED-01",
        event_type: "SERVO_SWEEP",
        servo1_angle: current,
        servo2_angle: current,
        button_state: "RELEASED"
      });
    }, 200);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {t('simulatorTitle')}
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Interactive Test Bench
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {t('simulatorDesc')}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleConnection}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition border border-slate-700"
        >
          {isConnected ? (
            <>
              <ToggleRight className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-mono">ESP32 ONLINE</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-rose-400" />
              <span className="text-rose-400 font-mono">ESP32 OFFLINE</span>
            </>
          )}
        </button>
      </div>

      {/* Simulator Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Action 1: Simulate Push Button Event */}
        <button
          onClick={handleSimulateButtonPress}
          disabled={!isConnected || simulatingRep}
          className={`p-4 rounded-xl border transition text-left flex flex-col justify-between ${
            isConnected
              ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-white'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Radio className={`w-5 h-5 ${simulatingRep ? 'text-emerald-400 animate-ping' : 'text-sky-400'}`} />
            <span className="text-[10px] font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">GPIO Pin 4</span>
          </div>
          <div>
            <div className="text-xs font-bold mb-0.5">{t('simTriggerButton')}</div>
            <div className="text-[11px] text-slate-400">Hardware Interrupt Event</div>
          </div>
        </button>

        {/* Action 2: Simulate Servo Angle Sweep */}
        <button
          onClick={handleSimulateServoSweep}
          disabled={!isConnected || simulatingSweep}
          className={`p-4 rounded-xl border transition text-left flex flex-col justify-between ${
            isConnected
              ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-white'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className={`w-5 h-5 ${simulatingSweep ? 'text-teal-400 animate-spin' : 'text-teal-400'}`} />
            <span className="text-[10px] font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">PWM 18/19</span>
          </div>
          <div>
            <div className="text-xs font-bold mb-0.5">{t('simServoSweep')}</div>
            <div className="text-[11px] text-slate-400">Flexion angle: {servoAngle}°</div>
          </div>
        </button>

        {/* Action 3: Telemetry Stream Indicator */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <PlayCircle className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono text-emerald-400">POST /api/ingest</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">FastAPI Sync</div>
            <div className="text-[11px] text-slate-400 truncate">Payload: {"{device_id: ESP32-DEXTRA-01}"}</div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-center font-mono">
        ⚠️ {t('simNotice')}
      </p>
    </div>
  );
}
