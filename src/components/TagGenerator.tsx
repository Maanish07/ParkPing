'use client';

import React, { useState } from 'react';
import { formatVehicleNumber } from '@/lib/mask';
import { VehicleDetails } from '@/lib/vahan';
import { VehicleTag, VehicleType } from '@/lib/types';
import PrintableBadge from './PrintableBadge';
import { VehicleSlot } from './CheckoutOrderModal';
import { 
  Car, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ShoppingCart,
  ArrowRight,
  Plus,
  Layers,
  Check,
  Edit2,
  HelpCircle
} from 'lucide-react';

interface TagGeneratorProps {
  onStartCheckout: (tagCount: 1 | 2 | 3, initialSlots: VehicleSlot[]) => void;
}

export default function TagGenerator({ onStartCheckout }: TagGeneratorProps) {
  const [tagCount, setTagCount] = useState<1 | 2 | 3>(1);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [samePhoneForAll, setSamePhoneForAll] = useState(true);

  // Slots for 3 cars
  const [slots, setSlots] = useState<VehicleSlot[]>([
    { vehicleNumber: '', mobileNumber: '', details: undefined, loadingDetails: false },
    { vehicleNumber: '', mobileNumber: '', details: undefined, loadingDetails: false },
    { vehicleNumber: '', mobileNumber: '', details: undefined, loadingDetails: false },
  ]);

  // Handle vehicle plate change for specific slot
  const handleVehicleChange = async (index: number, val: string) => {
    const formatted = formatVehicleNumber(val);
    const updated = [...slots];
    updated[index].vehicleNumber = formatted;
    setSlots(updated);

    const cleanLength = formatted.replace(/\s+/g, '').length;
    if (cleanLength >= 8) {
      updated[index].loadingDetails = true;
      setSlots([...updated]);
      try {
        const res = await fetch(`/api/vehicle-lookup?plate=${encodeURIComponent(formatted)}`);
        const data = await res.json();
        if (data.success && data.vehicle) {
          updated[index].details = data.vehicle;
        }
      } catch (err) {
        console.error('Vehicle lookup error:', err);
      } finally {
        updated[index].loadingDetails = false;
        setSlots([...updated]);
      }
    } else {
      updated[index].details = undefined;
      setSlots([...updated]);
    }
  };

  // Handle model change directly
  const handleModelChange = (index: number, val: string) => {
    const updated = [...slots];
    if (!updated[index].details) {
      updated[index].details = {
        vehicleNumber: updated[index].vehicleNumber,
        maker: 'Automobile',
        model: val,
        vehicleType: 'car',
        fuelType: 'Petrol',
        rtoLocation: 'RTO Office',
        state: 'India',
        registrationDate: 'Active',
        insuranceValidUntil: 'Active',
        pucValidUntil: 'Active',
        color: 'Standard',
        ownerMaskedName: 'V****** O****',
      };
    } else {
      updated[index].details = {
        ...updated[index].details!,
        model: val,
      };
    }
    setSlots(updated);
  };

  // Handle vehicle type change
  const handleTypeChange = (index: number, type: VehicleType) => {
    const updated = [...slots];
    if (updated[index].details) {
      updated[index].details = {
        ...updated[index].details!,
        vehicleType: type,
      };
    }
    setSlots(updated);
  };

  // Handle phone number change for specific slot
  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...slots];
    updated[index].mobileNumber = val;
    if (index === 0 && samePhoneForAll) {
      // Sync to other slots
      updated[1].mobileNumber = val;
      updated[2].mobileNumber = val;
    }
    setSlots(updated);
  };

  const handleToggleSamePhone = (checked: boolean) => {
    setSamePhoneForAll(checked);
    if (checked && slots[0].mobileNumber) {
      const updated = [...slots];
      updated[1].mobileNumber = slots[0].mobileNumber;
      updated[2].mobileNumber = slots[0].mobileNumber;
      setSlots(updated);
    }
  };

  const getPrice = () => {
    if (tagCount === 1) return 399;
    if (tagCount === 2) return 699;
    return 899;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSlots = slots.slice(0, tagCount);
    for (let i = 0; i < tagCount; i++) {
      if (!activeSlots[i].vehicleNumber.trim()) {
        alert(`Please enter the vehicle registration number for Car #${i + 1}`);
        return;
      }
      if (!activeSlots[i].mobileNumber.trim()) {
        alert(`Please enter the owner mobile number for Car #${i + 1}`);
        return;
      }
    }
    onStartCheckout(tagCount, activeSlots);
  };

  const currentPreviewSlot = slots[activePreviewIndex] || slots[0];
  const liveMockupTag: VehicleTag = {
    id: `PP-${activePreviewIndex + 1}`,
    vehicleNumber: currentPreviewSlot.vehicleNumber ? formatVehicleNumber(currentPreviewSlot.vehicleNumber) : (activePreviewIndex === 0 ? 'DL 01 AB 1234' : activePreviewIndex === 1 ? 'MH 12 CD 5678' : 'KA 03 EF 9012'),
    phoneNumber: currentPreviewSlot.mobileNumber || '+91 98765 43210',
    ownerName: 'Vehicle Owner',
    vehicleModel: currentPreviewSlot.details?.model || (activePreviewIndex === 0 ? 'Hyundai Creta' : activePreviewIndex === 1 ? 'Tata Nexon' : 'Mahindra Thar'),
    vehicleType: currentPreviewSlot.details?.vehicleType || 'car',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0,
    badgeTheme: 'amber_neon',
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
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
          Enter Vehicle Details to Order
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          Select your pack below. We automatically verify vehicle details from the Pan-India RTO database and generate your personalized smart QR tag.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 pt-6 sm:pt-8 items-start relative z-10">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Step 1: Pack Selection Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              1. Choose Smart Tag Package:
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* 1 Car */}
              <button
                type="button"
                onClick={() => {
                  setTagCount(1);
                  setActivePreviewIndex(0);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                  tagCount === 1
                    ? 'border-amber-400 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-black text-slate-900">1 Car Tag</div>
                <div className="text-sm sm:text-base font-black text-slate-950 mt-0.5">₹399</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Individual Tag</div>
                {tagCount === 1 && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>

              {/* 2 Cars Combo */}
              <button
                type="button"
                onClick={() => {
                  setTagCount(2);
                  setActivePreviewIndex(0);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                  tagCount === 2
                    ? 'border-amber-400 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black uppercase shadow-sm">
                  Save ₹99
                </span>
                <div className="text-[11px] sm:text-xs font-black text-slate-900">2 Cars Combo</div>
                <div className="text-sm sm:text-base font-black text-slate-950 mt-0.5">₹699</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-700 font-bold">₹349 / tag</div>
                {tagCount === 2 && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>

              {/* 3 Cars Family */}
              <button
                type="button"
                onClick={() => {
                  setTagCount(3);
                  setActivePreviewIndex(0);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                  tagCount === 3
                    ? 'border-amber-400 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase shadow-sm">
                  Best Value
                </span>
                <div className="text-[11px] sm:text-xs font-black text-slate-900">3 Cars Family</div>
                <div className="text-sm sm:text-base font-black text-slate-950 mt-0.5">₹899</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-700 font-bold">₹299 / tag</div>
                {tagCount === 3 && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sync phone number checkbox for multi-car pack */}
          {tagCount > 1 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <input
                type="checkbox"
                id="samePhoneToggle"
                checked={samePhoneForAll}
                onChange={(e) => handleToggleSamePhone(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <label htmlFor="samePhoneToggle" className="cursor-pointer font-medium select-none">
                Use same mobile number for all {tagCount} vehicles
              </label>
            </div>
          )}

          {/* Dynamic Vehicle Slots */}
          <div className="space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>2. Enter Vehicle Details ({tagCount} {tagCount === 1 ? 'Vehicle' : 'Vehicles'}):</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Number Masked
              </span>
            </div>

            {Array.from({ length: tagCount }).map((_, idx) => {
              const slot = slots[idx];
              return (
                <div
                  key={idx}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition space-y-3.5 ${
                    activePreviewIndex === idx
                      ? 'bg-slate-50/90 border-amber-400 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        Vehicle #{idx + 1} Registration
                      </span>
                    </div>

                    {slot.loadingDetails && (
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Fetching RTO Details...
                      </span>
                    )}
                  </div>

                  {/* Vehicle Number Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Vehicle Registration Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={idx === 0 ? 'e.g. DL 01 AB 1234' : idx === 1 ? 'e.g. MH 12 CD 5678' : 'e.g. KA 03 EF 9012'}
                        value={slot.vehicleNumber}
                        onChange={(e) => handleVehicleChange(idx, e.target.value)}
                        className="w-full bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl pl-3.5 pr-14 py-2.5 text-base sm:text-lg font-mono font-black text-slate-950 placeholder:text-slate-400 focus:outline-none uppercase transition tracking-wider shadow-inner"
                      />
                      <div className="absolute right-2.5 top-2.5 px-2 py-1 rounded bg-blue-900 text-white font-black text-[9px] font-mono tracking-wider">
                        IND
                      </div>
                    </div>
                  </div>

                  {/* Auto-Fetched Vehicle Card & Editable Model */}
                  {slot.details && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-2 text-xs animate-fadeIn shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-emerald-950 font-black">{slot.details.rtoLocation}</span>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                          {slot.details.source === 'live_vahan_api' ? '✓ Live Vahan Verified' : '✓ RTO Verified'}
                        </span>
                      </div>

                      {/* Editable Car Model & Variant */}
                      <div className="pt-1">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                          <span>Vehicle Model / Name (Confirm or Edit):</span>
                          <span className="text-[10px] font-normal text-slate-500 flex items-center gap-1">
                            <Edit2 className="w-3 h-3 text-amber-600" /> Editable
                          </span>
                        </label>
                        <input
                          type="text"
                          value={slot.details.model}
                          onChange={(e) => handleModelChange(idx, e.target.value)}
                          placeholder="e.g. Hyundai Creta, Maruti Swift, Thar 4x4, Royal Enfield"
                          className="w-full bg-white border border-emerald-300 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-600 pt-0.5">
                        <span>State: <strong className="text-slate-900">{slot.details.state}</strong></span>
                        <span>•</span>
                        <span>Fuel: <strong className="text-amber-800">{slot.details.fuelType}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Owner Mobile Number Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Owner Mobile Number (For Masked Voice & WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={slot.mobileNumber}
                        disabled={idx > 0 && samePhoneForAll}
                        onChange={(e) => handlePhoneChange(idx, e.target.value)}
                        className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-base sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-inner ${
                          idx > 0 && samePhoneForAll
                            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-white border-slate-300 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Order Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 sm:px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg tracking-wide glow-yellow transition transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              <span>Order {tagCount === 1 ? '1 Smart Tag' : `${tagCount} Smart Tags Combo`} · ₹{getPrice()}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] text-slate-500 mt-3 text-center">
              <span>🚚 Free Delivery Across India</span>
              <span className="hidden sm:inline">•</span>
              <span>💵 Cash on Delivery Available</span>
              <span className="hidden sm:inline">•</span>
              <span>⚡ Ships in 24 Hrs</span>
            </div>
          </div>
        </form>

        {/* Right Live Tag Product Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl sticky top-24">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Live Sticker Preview
            </div>

            {/* Car Preview Switcher for multi-car packs */}
            {tagCount > 1 && (
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                {Array.from({ length: tagCount }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      activePreviewIndex === idx
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Car #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <PrintableBadge tag={liveMockupTag} compact />

          <div className="text-[11px] text-slate-400 text-center mt-4 font-medium">
            Personalized 3M Vinyl Sticker • 100% Waterproof & Weatherproof
          </div>
        </div>
      </div>
    </div>
  );
}
