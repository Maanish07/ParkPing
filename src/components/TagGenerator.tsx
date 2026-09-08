'use client';

import React, { useState } from 'react';
import { formatVehicleNumber } from '@/lib/mask';
import { VehicleDetails } from '@/lib/vahan';
import { VehicleTag } from '@/lib/types';
import PrintableBadge from './PrintableBadge';
import { 
  Car, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Layers, 
  ShoppingCart,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';

interface TagGeneratorProps {
  onStartCheckout: (initialVehicleNumber?: string) => void;
}

export default function TagGenerator({ onStartCheckout }: TagGeneratorProps) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tagCount, setTagCount] = useState<1 | 2 | 3>(1);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);

  // Auto-fetch vehicle details from Vahan
  const handleVehicleChange = async (val: string) => {
    const formatted = formatVehicleNumber(val);
    setVehicleNumber(formatted);

    const cleanLength = formatted.replace(/\s+/g, '').length;
    if (cleanLength >= 8) {
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/vehicle-lookup?plate=${encodeURIComponent(formatted)}`);
        const data = await res.json();
        if (data.success && data.vehicle) {
          setVehicleDetails(data.vehicle);
        }
      } catch (err) {
        console.error('Vehicle lookup error:', err);
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setVehicleDetails(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim() || !mobileNumber.trim()) {
      alert('Please enter your Vehicle Number and Mobile Number');
      return;
    }
    onStartCheckout(vehicleNumber);
  };

  const getPrice = () => {
    if (tagCount === 1) return 399;
    if (tagCount === 2) return 699;
    return 899;
  };

  const liveMockupTag: VehicleTag = {
    id: 'PP-SAMPARK',
    vehicleNumber: vehicleNumber ? formatVehicleNumber(vehicleNumber) : 'DL 01 AB 1234',
    phoneNumber: mobileNumber || '+91 98765 43210',
    ownerName: 'Vehicle Owner',
    vehicleModel: vehicleDetails?.model || 'Hyundai Creta',
    vehicleType: vehicleDetails?.vehicleType || 'car',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0,
    badgeTheme: 'amber_neon',
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pb-8 border-b border-white/10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Get Your Smart Vehicle Tag
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Enter Vehicle Number to Order
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          We automatically fetch your car specs from the Vahan RTO database and generate your personalized smart QR tag.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 relative z-10 items-center">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
              Select Tag Pack:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { count: 1, title: '1 Car Tag', price: '₹399', orig: '₹799', badge: 'Popular' },
                { count: 2, title: '2 Cars Combo', price: '₹699', orig: '₹1599', badge: 'Save ₹100' },
                { count: 3, title: '3 Cars Family', price: '₹899', orig: '₹2399', badge: 'Best Value' },
              ].map((p) => (
                <button
                  key={p.count}
                  type="button"
                  onClick={() => setTagCount(p.count as any)}
                  className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition relative ${
                    tagCount === p.count
                      ? 'bg-yellow-400/15 border-yellow-400 text-white glow-yellow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-yellow-400 text-black self-end mb-1">
                    {p.badge}
                  </div>
                  <div className="text-xs font-black text-white">{p.title}</div>
                  <div className="mt-1">
                    <span className="text-sm font-black text-yellow-400">{p.price}</span>{' '}
                    <span className="text-[10px] line-through text-slate-500">{p.orig}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Number Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Vehicle Registration Number *</span>
              {loadingDetails && (
                <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                  <div className="w-2.5 h-2.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  Fetching Vahan RTO details...
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. DL 01 AB 1234"
                value={vehicleNumber}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-yellow-400 rounded-2xl px-4 py-3.5 text-xl font-mono font-black text-yellow-400 placeholder:text-slate-600 focus:outline-none uppercase transition tracking-wider shadow-inner"
              />
              <div className="absolute right-3.5 top-3.5 px-2.5 py-1 rounded bg-blue-900 text-white font-black text-[10px] font-mono tracking-wider">
                IND
              </div>
            </div>
          </div>

          {/* Auto-Fetched Vehicle Card */}
          {vehicleDetails && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs animate-fadeIn shadow-md">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{vehicleDetails.model}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({vehicleDetails.color})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {vehicleDetails.rtoLocation} • Fuel: <strong className="text-yellow-400">{vehicleDetails.fuelType}</strong> • Insurance: Valid
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 shrink-0">
                ✓ RTO Verified
              </span>
            </div>
          )}

          {/* Mobile Number Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">
              Owner Mobile Number (For Masked Voice Relay & WhatsApp) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-400 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
              />
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your number remains 100% private and masked when scanned.
            </div>
          </div>

          {/* CTA Order Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base tracking-wide glow-yellow transition transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Order Smart Tag · ₹{getPrice()}
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-2.5">
              <span>🚚 Free Delivery Across India</span>
              <span>•</span>
              <span>💵 Cash on Delivery Available</span>
              <span>•</span>
              <span>⚡ Ships in 24 Hrs</span>
            </div>
          </div>
        </form>

        {/* Right Live Tag Product Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            Live Tag Preview on Glass
          </div>
          <PrintableBadge tag={liveMockupTag} compact />
        </div>
      </div>
    </div>
  );
}
