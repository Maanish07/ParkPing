'use client';

import React, { useState } from 'react';
import { VehicleTag } from '@/lib/types';
import { maskPhoneNumber } from '@/lib/mask';
import { QUICK_ALERTS } from '@/lib/templates';
import { 
  Smartphone, 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Car, 
  Lock, 
  Lightbulb, 
  BellRing,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface PasserbyMobileMockupProps {
  tag: VehicleTag;
}

export default function PasserbyMobileMockup({ tag }: PasserbyMobileMockupProps) {
  const [selectedAlertIndex, setSelectedAlertIndex] = useState(0);
  const [isCallingSim, setIsCallingSim] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [alertSent, setAlertSent] = useState(false);

  const selectedAlert = QUICK_ALERTS[selectedAlertIndex];

  const handleStartCallSim = () => {
    setIsCallingSim(true);
    setCallTimer(0);
    const interval = setInterval(() => {
      setCallTimer((s) => s + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsCallingSim(false);
    }, 7000);
  };

  const handleSendMockAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
      {/* Left Info Column */}
      <div className="lg:max-w-md space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <Smartphone className="w-3.5 h-3.5" />
          Interactive Passerby Demo
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          Test What Others See When They Scan Your Car
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed">
          Try clicking inside the simulated iPhone to test the masked voice call and 1-click WhatsApp alert. 
          Notice how your real phone number is protected behind <strong className="text-yellow-400 font-mono">({maskPhoneNumber(tag.phoneNumber)})</strong>.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span><strong>No App Required</strong> — Anyone can scan with normal camera.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span><strong>Masked Voice Relay</strong> — Connects in seconds without revealing numbers.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span><strong>1-Click WhatsApp Alerts</strong> — Quick emergency alerts for blocking, lights, etc.</span>
          </div>
        </div>
      </div>

      {/* Right Smartphone Frame (iPhone 16 Pro Style) */}
      <div className="relative w-[310px] sm:w-[330px] h-[600px] bg-slate-950 rounded-[48px] border-[7px] border-slate-700 shadow-2xl p-3.5 flex flex-col justify-between overflow-hidden shrink-0">
        {/* Dynamic Island */}
        <div className="w-full flex items-center justify-center pt-1 pb-2">
          <div className="w-28 h-5 bg-black rounded-full flex items-center justify-between px-3">
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 bg-[#090d16] rounded-[34px] p-4 flex flex-col justify-between overflow-y-auto border border-white/5 text-center shadow-inner">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-black text-[11px] text-white tracking-wider">PARKPING</span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Masked
            </span>
          </div>

          {/* Indian Plate Card inside Mockup */}
          <div className="my-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow">
            <div className="w-full rounded-lg border-2 border-black bg-yellow-400 text-black flex items-center shadow-md overflow-hidden">
              <div className="bg-blue-900 text-white px-1.5 py-1 text-[8px] font-black leading-none border-r border-black">
                IND
              </div>
              <div className="flex-1 py-1 px-1 text-sm font-black font-mono tracking-widest text-center">
                {tag.vehicleNumber}
              </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-300 mt-1.5 truncate">
              {tag.vehicleModel || 'Vehicle'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Owner: {maskPhoneNumber(tag.phoneNumber)}
            </div>
          </div>

          {/* Call Relay Button inside Phone */}
          {isCallingSim ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-yellow-400/60 flex flex-col items-center gap-2 animate-fadeIn shadow-lg">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black animate-bounce">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Masked Voice Relay Live</div>
              <div className="text-sm font-mono text-emerald-400 font-black">00:0{callTimer}</div>
              <div className="text-[9px] text-slate-400">Talking to owner privately</div>
            </div>
          ) : (
            <button
              onClick={handleStartCallSim}
              className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs glow-yellow transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Owner (Masked)
            </button>
          )}

          {/* Alerts Grid inside Mockup */}
          <div className="space-y-1.5 my-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 text-left">
              Quick 1-Click Alerts:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_ALERTS.slice(0, 4).map((alert, idx) => (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlertIndex(idx)}
                  className={`p-2 rounded-xl text-left text-[10px] font-bold border transition ${
                    selectedAlertIndex === idx
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="truncate">{alert.label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSendMockAlert}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] glow-emerald transition flex items-center justify-center gap-1 mt-1 active:scale-95"
            >
              <Send className="w-3 h-3" />
              Send &ldquo;{selectedAlert.label}&rdquo;
            </button>
          </div>

          {/* Alert Sent Banner */}
          {alertSent && (
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 animate-fadeIn">
              ✓ Dispatched to WhatsApp
            </div>
          )}

          <div className="text-[9px] text-slate-500 pt-1">
            Zero Number Leak • Protected by ParkPing
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="w-full flex items-center justify-center py-1">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
