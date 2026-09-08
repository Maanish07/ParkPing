'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, ShieldCheck, Volume2, Mic, Radio, X, Sparkles } from 'lucide-react';

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
    // Step 1: Connecting (1.5s)
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Relay Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          ParkPing Privacy Shield Active
        </div>

        {/* Animated Avatar / Radar */}
        <div className="relative my-4 flex items-center justify-center">
          {callState !== 'ended' && (
            <div className="absolute w-28 h-28 rounded-full bg-brand-500/20 animate-ping pointer-events-none" />
          )}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-brand-500 flex items-center justify-center shadow-glow z-10">
            <Phone className="w-10 h-10 text-brand-400 animate-bounce" />
          </div>
        </div>

        {/* Vehicle & Masked Number */}
        <div className="my-2">
          <div className="inline-block bg-yellow-400 text-black font-black plate-font text-lg px-3 py-0.5 rounded-md mb-1">
            {vehicleNumber}
          </div>
          <div className="text-sm font-mono font-bold text-slate-300 mt-1">
            Calling: {maskedPhone}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Your phone number is also kept 100% private
          </div>
        </div>

        {/* Call State / Duration */}
        <div className="my-4">
          {callState === 'connecting' && (
            <div className="text-xs font-bold text-brand-400 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Routing through Masked Bridge...
            </div>
          )}
          {callState === 'ringing' && (
            <div className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Ringing Owner...
            </div>
          )}
          {callState === 'connected' && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-mono font-bold text-emerald-400">
                {formatTimer(callSeconds)}
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold">
                ● Live Voice Relay Connected
              </div>
            </div>
          )}
          {callState === 'ended' && (
            <div className="text-xs font-bold text-rose-400">
              Call Ended
            </div>
          )}
        </div>

        {/* Waveform Animation during connection */}
        {callState === 'connected' && (
          <div className="flex items-center gap-1 my-3 h-8">
            {[40, 70, 30, 90, 60, 80, 45, 100, 55, 75].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-brand-400 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Call Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={callState !== 'connected'}
            className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              isMuted
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isMuted ? 'Unmute' : 'Mute'}
          </button>

          <button
            onClick={handleEndCall}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg transition"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}
