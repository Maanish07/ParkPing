'use client';

import React from 'react';
import { ShieldCheck, Droplets, Sun, Sparkles, Award, Layers, Zap, Check } from 'lucide-react';

export default function StickerShowcase() {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          Automotive Grade Material
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Built to Endure Indian Roads & Weather
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Engineered for extreme summer heat, monsoon downpours, and daily wiper friction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 shadow">
            <Droplets className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1.5">100% Waterproof</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Withstands intense car pressure washes, monsoon rains, and windshield washer fluids.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow">
            <Sun className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1.5">UV & Heat Resistant</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rated for 50°C+ summer dashboard heat without peeling, fading, or bubbling.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 shadow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1.5">Zero Residue Peel</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leaves no sticky glue stains or film on your glass when replacing or transferring.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mb-4 shadow">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1.5">Optical High-Contrast QR</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scans instantly under tinted glass, nighttime lighting, and harsh direct sunlight.
          </p>
        </div>
      </div>
    </div>
  );
}
