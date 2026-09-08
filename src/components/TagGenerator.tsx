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
  ShoppingCart,
  ArrowRight
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
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pb-6 sm:pb-8 border-b border-slate-200 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Get Your Smart Vehicle Tag
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Enter Vehicle Number to Order
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          We automatically fetch your car specs from the Vahan RTO database and generate your personalized smart QR tag.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 pt-6 sm:pt-8 relative z-10 items-center">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Select Tag Pack:
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { count: 1, title: '1 Car Tag', price: '₹399', orig: '₹799', badge: 'Popular' },
                { count: 2, title: '2 Cars Combo', price: '₹699', orig: '₹1599', badge: 'Save ₹100' },
                { count: 3, title: '3 Cars Family', price: '₹899', orig: '₹2399', badge: 'Best Value' },
              ].map((p) => (
                <button
                  key={p.count}
                  type="button"
                  onClick={() => setTagCount(p.count as any)}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition relative ${
                    tagCount === p.count
                      ? 'bg-amber-50/80 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 self-end mb-1">
                    {p.badge}
                  </div>
                  <div className="text-xs font-black text-slate-900">{p.title}</div>
                  <div className="mt-1">
                    <span className="text-sm font-black text-amber-600">{p.price}</span>{' '}
                    <span className="text-[10px] line-through text-slate-400">{p.orig}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Number Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Vehicle Registration Number *</span>
              {loadingDetails && (
                <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                  <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-2xl px-4 py-3.5 text-xl font-mono font-black text-slate-950 placeholder:text-slate-400 focus:outline-none uppercase transition tracking-wider shadow-inner"
              />
              <div className="absolute right-3.5 top-3.5 px-2.5 py-1 rounded bg-blue-900 text-white font-black text-[10px] font-mono tracking-wider">
                IND
              </div>
            </div>
          </div>

          {/* Auto-Fetched Vehicle Card */}
          {vehicleDetails && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300/80 flex items-center justify-between gap-3 text-xs animate-fadeIn shadow-sm">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{vehicleDetails.model}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({vehicleDetails.color})</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {vehicleDetails.rtoLocation} • Fuel: <strong className="text-amber-700">{vehicleDetails.fuelType}</strong> • Insurance: Valid
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                ✓ RTO Verified
              </span>
            </div>
          )}

          {/* Mobile Number Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Owner Mobile Number (For Masked Voice Relay & WhatsApp) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-inner"
              />
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your number remains 100% private and masked when scanned.
            </div>
          </div>

          {/* CTA Order Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 sm:px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg tracking-wide glow-yellow transition transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              <span>Order Smart Tag · ₹{getPrice()}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] text-slate-500 mt-3 text-center">
              <span>🚚 Free Delivery Across India</span>
              <span className="hidden sm:inline">•</span>
              <span>💵 Cash on Delivery</span>
              <span className="hidden sm:inline">•</span>
              <span>⚡ Ships in 24 Hrs</span>
            </div>
          </div>
        </form>

        {/* Right Live Tag Product Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div className="text-xs font-black uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Live Tag Preview on Windshield
          </div>
          <PrintableBadge tag={liveMockupTag} compact />
        </div>
      </div>
    </div>
  );
}
