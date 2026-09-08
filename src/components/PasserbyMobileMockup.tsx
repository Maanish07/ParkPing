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
  RotateCcw
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
    }, 6000);
  };

  const handleSendMockAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Left Info Column */}
      <div className="lg:max-w-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Smartphone className="w-3.5 h-3.5" />
          Interactive Passerby Demo
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white">
          Test What Others See When They Scan Your Car
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed">
          Try clicking inside the simulated smartphone to test the masked call relay and quick WhatsApp alert. 
          Notice how your real phone number <strong className="text-yellow-400 font-mono">({maskPhoneNumber(tag.phoneNumber)})</strong> is completely masked.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Passersby do NOT need to download any mobile app.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant connection via native phone dialer / WhatsApp.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Spam & unwanted call blocking with smart rate limits.</span>
          </div>
        </div>
      </div>

      {/* Right Smartphone Mockup Frame */}
      <div className="relative w-[300px] sm:w-[320px] h-[580px] bg-slate-950 rounded-[44px] border-[6px] border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden shrink-0">
        {/* Dynamic Island / Speaker */}
        <div className="w-full flex items-center justify-center pt-1 pb-2">
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full mr-2" />
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Phone Screen Viewport */}
        <div className="flex-1 bg-[#090d16] rounded-[32px] p-4 flex flex-col justify-between overflow-y-auto border border-white/5 text-center">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-extrabold text-[11px] text-white tracking-wider">PARKPING</span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Masked
            </span>
          </div>

          {/* Vehicle Card Inside Mockup */}
          <div className="my-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="inline-block bg-yellow-400 text-black font-black plate-font text-base px-2.5 py-0.5 rounded shadow">
              {tag.vehicleNumber}
            </div>
            <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">
              {tag.vehicleModel || 'Vehicle'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {maskPhoneNumber(tag.phoneNumber)}
            </div>
          </div>

          {/* Call Simulator inside Phone */}
          {isCallingSim ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-brand-500/50 flex flex-col items-center gap-2 animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black animate-bounce">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Masked Relay Connected</div>
              <div className="text-xs font-mono text-emerald-400 font-bold">00:0{callTimer}</div>
              <div className="text-[9px] text-slate-400">Talking to owner privately</div>
            </div>
          ) : (
            <button
              onClick={handleStartCallSim}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-glow transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Owner (Masked)
            </button>
          )}

          {/* Alert Buttons inside Mockup */}
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
                      ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="truncate">{alert.label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSendMockAlert}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] shadow-glow-emerald transition flex items-center justify-center gap-1 mt-1 active:scale-95"
            >
              <Send className="w-3 h-3" />
              Send &ldquo;{selectedAlert.label}&rdquo;
            </button>
          </div>

          {/* Alert Sent Confirmation */}
          {alertSent && (
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 animate-fadeIn">
              ✓ Dispatched to WhatsApp
            </div>
          )}

          {/* Footer note in Mockup */}
          <div className="text-[9px] text-slate-500 pt-1">
            Zero Number Leak • Protected by ParkPing
          </div>
        </div>

        {/* Home Bar Indicator */}
        <div className="w-full flex items-center justify-center py-1">
          <div className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
