'use client';

import React from 'react';
import { ShieldCheck, Droplets, Sun, Sparkles, Award, Layers, Zap } from 'lucide-react';

export default function StickerShowcase() {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          Automotive Grade Material
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Built for Indian Roads & Weather
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Whether you print it at home or use our commercial vinyl sheets, ParkPing tags are engineered to last years on your windshield.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
            <Droplets className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">100% Waterproof</h4>
          <p className="text-xs text-slate-400">
            Resistant to heavy car washes, monsoon rains, and windshield wiper fluid.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
            <Sun className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">UV & Sunfade Proof</h4>
          <p className="text-xs text-slate-400">
            Engineered to endure 45°C+ summer heat without peeling, fading, or curling.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Zero Residue Removal</h4>
          <p className="text-xs text-slate-400">
            Leaves no sticky glue marks on your glass when peeled or replaced.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">High-Contrast Optical QR</h4>
          <p className="text-xs text-slate-400">
            Scans instantly under tinted glass, low light, and direct sunlight reflections.
          </p>
        </div>
      </div>
    </div>
  );
}
