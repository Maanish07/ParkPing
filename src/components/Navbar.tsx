'use client';

import React from 'react';
import { Sparkles, Printer, Clock, Layers, Car, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  totalVehicles: number;
  activeCount: number;
  totalPings: number;
  onOpenBulkPrint: () => void;
  onOpenLogs: () => void;
  onScrollToGenerator: () => void;
}

export default function Navbar({
  totalVehicles,
  activeCount,
  totalPings,
  onOpenBulkPrint,
  onOpenLogs,
  onScrollToGenerator,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 via-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-glow">
              PP
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white flex items-center gap-2">
                <span>PARKPING</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Smart Scanner Hub
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Number Leak • Smart Multi-Car QR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-brand-400" />
            <div className="text-xs">
              <span className="text-slate-400">Total Cars:</span>{' '}
              <strong className="text-white font-mono font-bold">{totalVehicles}</strong>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Active Tags:</span>{' '}
              <strong className="text-emerald-400 font-mono font-bold">{activeCount}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={onOpenLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition shadow"
          >
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Activity Logs</span>
          </button>

          <button
            onClick={onOpenBulkPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition shadow"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Batch Print</span>
          </button>

          <button
            onClick={onScrollToGenerator}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-glow transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Create Scanner</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
