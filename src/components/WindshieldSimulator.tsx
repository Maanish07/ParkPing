'use client';

import React, { useState } from 'react';
import { VehicleTag } from '@/lib/types';
import PrintableBadge from './PrintableBadge';
import { Eye, ShieldCheck } from 'lucide-react';

interface WindshieldSimulatorProps {
  selectedTag?: VehicleTag;
}

export default function WindshieldSimulator({ selectedTag }: WindshieldSimulatorProps) {
  const [carType, setCarType] = useState<'suv' | 'sedan' | 'ev'>('suv');
  const [placement, setPlacement] = useState<'bottom_left' | 'top_center' | 'bottom_right'>('bottom_left');

  const defaultTag: VehicleTag = selectedTag || {
    id: 'PP-48291',
    vehicleNumber: 'DL 01 AB 1234',
    phoneNumber: '+91 98765 43210',
    ownerName: 'Rahul Sharma',
    vehicleModel: 'Hyundai Creta',
    vehicleType: 'suv',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 12,
    badgeTheme: 'amber_neon',
  };

  const getPlacementClass = () => {
    switch (placement) {
      case 'bottom_left':
        return 'bottom-6 left-6 sm:bottom-12 sm:left-14';
      case 'top_center':
        return 'top-8 left-1/2 -translate-x-1/2';
      case 'bottom_right':
      default:
        return 'bottom-6 right-6 sm:bottom-12 sm:right-14';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            Interactive Windshield Simulator
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            See How It Looks on Your Car
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Preview the smart QR sticker placement on your car windshield. Easy to scan for passersby, 100% clean aesthetics.
          </p>
        </div>

        {/* Car Models */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          {[
            { id: 'suv', label: 'SUV / Creta' },
            { id: 'sedan', label: 'Sedan / City' },
            { id: 'ev', label: 'EV / Nexon' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setCarType(type.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                carType === type.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Viewport */}
      <div className="my-6 relative w-full h-[360px] sm:h-[460px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Car Windshield Glass */}
        <div className="absolute inset-4 sm:inset-8 rounded-t-[60px] sm:rounded-t-[120px] border-t-4 border-x-4 border-slate-700 bg-gradient-to-b from-sky-950/40 via-slate-900/60 to-slate-950/95 shadow-2xl backdrop-blur-[2px] overflow-hidden flex flex-col justify-between">
          
          {/* Rearview Mirror */}
          <div className="w-full flex items-center justify-center pt-2">
            <div className="w-28 sm:w-32 h-6 sm:h-7 bg-slate-800 rounded-b-2xl border-b border-x border-slate-700 flex items-center justify-center shadow-md">
              <div className="w-16 sm:w-20 h-2 bg-slate-950 rounded-full" />
            </div>
          </div>

          {/* Light Reflections */}
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -rotate-45 pointer-events-none" />

          {/* Wiper Blades */}
          <div className="w-full flex items-center justify-between px-6 sm:px-10 pb-1 z-10">
            <div className="w-32 sm:w-40 h-2 sm:h-2.5 bg-slate-800 rounded-full shadow-md transform -rotate-6" />
            <div className="w-36 sm:w-48 h-2 sm:h-2.5 bg-slate-800 rounded-full shadow-md transform rotate-3" />
          </div>
        </div>

        {/* The Placed Sticker on Glass */}
        <div className={`absolute z-20 transform scale-[0.65] sm:scale-90 hover:scale-95 transition duration-300 ${getPlacementClass()}`}>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition" />
            <PrintableBadge tag={defaultTag} compact />
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-3 left-4 text-[10px] sm:text-[11px] font-mono text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 z-30 shadow">
          Showing: <strong className="text-amber-400 font-bold">{defaultTag.vehicleNumber}</strong> on {carType.toUpperCase()}
        </div>
      </div>

      {/* Placement Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <span className="font-bold text-slate-900">Placement:</span>
          {[
            { id: 'bottom_left', label: 'Bottom Left (Driver)' },
            { id: 'top_center', label: 'Top Center' },
            { id: 'bottom_right', label: 'Bottom Right' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlacement(p.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                placement === p.id
                  ? 'bg-amber-400 border-amber-400 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Compliant with Indian Motor Vehicle Windshield guidelines</span>
        </div>
      </div>
    </div>
  );
}
