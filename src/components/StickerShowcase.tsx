'use client';

import React from 'react';
import { Droplets, Sun, Sparkles, Award, Zap } from 'lucide-react';

export default function StickerShowcase() {
  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          Automotive Grade Material
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Built to Endure Indian Roads & Weather
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          Engineered for extreme summer heat, monsoon downpours, and daily wiper friction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center mb-4 shadow-sm">
            <Droplets className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1.5">100% Waterproof</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Withstands intense car pressure washes, monsoon rains, and windshield washer fluids.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
            <Sun className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1.5">UV & Heat Resistant</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Rated for 50°C+ summer dashboard heat without peeling, fading, or bubbling.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1.5">Zero Residue Peel</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Leaves no sticky glue stains or film on your glass when replacing or transferring.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 border border-yellow-300 text-yellow-800 flex items-center justify-center mb-4 shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1.5">Optical High-Contrast QR</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Scans instantly under tinted glass, nighttime lighting, and harsh direct sunlight.
          </p>
        </div>
      </div>
    </div>
  );
}
