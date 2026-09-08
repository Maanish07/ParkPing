'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, ShieldCheck, Mic, X } from 'lucide-react';

interface MaskedCallModalProps {
  vehicleNumber: string;
  maskedPhone: string;
  onClose: () => void;
}

export default function MaskedCallModal({
  vehicleNumber,
  maskedPhone,
  onClose,
}: MaskedCallModalProps) {
  const [callState, setCallState] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Step 1: Connecting (1.8s)
    const timer1 = setTimeout(() => {
      setCallState('ringing');
    }, 1800);

    // Step 2: Ringing -> Connected (after 3s)
    const timer2 = setTimeout(() => {
      setCallState('connected');
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Timer for connected state
  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Relay Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ParkPing Privacy Shield Active
        </div>

        {/* Animated Avatar / Radar */}
        <div className="relative my-3 flex items-center justify-center">
          {callState !== 'ended' && (
            <div className="absolute w-24 h-24 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
          )}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-amber-300 flex items-center justify-center shadow-lg z-10 text-slate-950">
            <Phone className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Vehicle & Masked Number */}
        <div className="my-2">
          <div className="inline-block bg-amber-400 text-slate-950 font-black plate-font text-lg px-3 py-0.5 rounded-md mb-1 shadow-sm border border-slate-950">
            {vehicleNumber}
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 mt-1">
            Calling: {maskedPhone}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Your phone number is also kept 100% private
          </div>
        </div>

        {/* Call State / Duration */}
        <div className="my-4">
          {callState === 'connecting' && (
            <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Routing through Masked Bridge...
            </div>
          )}
          {callState === 'ringing' && (
            <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Ringing Vehicle Owner...
            </div>
          )}
          {callState === 'connected' && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-xl font-mono font-black text-emerald-600">
                {formatTimer(callSeconds)}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Voice Relay Connected
              </div>
            </div>
          )}
          {callState === 'ended' && (
            <div className="text-xs font-bold text-rose-600">
              Call Ended
            </div>
          )}
        </div>

        {/* Waveform Animation during connection */}
        {callState === 'connected' && (
          <div className="flex items-center gap-1 my-2 h-7">
            {[40, 70, 30, 90, 60, 80, 45, 100, 55, 75].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-amber-500 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Call Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={callState !== 'connected'}
            className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isMuted
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isMuted ? 'Unmute' : 'Mute'}
          </button>

          <button
            onClick={handleEndCall}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}
