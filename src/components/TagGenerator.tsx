'use client';

import React, { useState } from 'react';
import { VehicleTag, CreateTagInput, VehicleType, BadgeTheme } from '@/lib/types';
import { formatVehicleNumber } from '@/lib/mask';
import PrintableBadge from './PrintableBadge';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Car, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  AlertCircle,
  FileSpreadsheet,
  Zap,
  Lock
} from 'lucide-react';

interface TagGeneratorProps {
  onTagsCreated: (tags: VehicleTag[]) => void;
}

interface BulkVehicleRow {
  id: string;
  vehicleNumber: string;
  phoneNumber: string;
  alternatePhone?: string;
  vehicleModel: string;
  vehicleType: VehicleType;
}

export default function TagGenerator({ onTagsCreated }: TagGeneratorProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Single mode state
  const [singleInput, setSingleInput] = useState<CreateTagInput>({
    vehicleNumber: '',
    phoneNumber: '',
    alternatePhone: '',
    ownerName: '',
    vehicleModel: '',
    vehicleType: 'car',
    badgeTheme: 'amber_neon',
    statusMessage: '',
  });

  // Bulk mode state
  const [bulkRows, setBulkRows] = useState<BulkVehicleRow[]>([
    {
      id: 'row-1',
      vehicleNumber: '',
      phoneNumber: '',
      alternatePhone: '',
      vehicleModel: '',
      vehicleType: 'car',
    },
    {
      id: 'row-2',
      vehicleNumber: '',
      phoneNumber: '',
      alternatePhone: '',
      vehicleModel: '',
      vehicleType: 'suv',
    },
  ]);

  const [applySamePhone, setApplySamePhone] = useState(false);
  const [bulkOwnerName, setBulkOwnerName] = useState('');
  const [bulkPrimaryPhone, setBulkPrimaryPhone] = useState('');
  const [bulkTheme, setBulkTheme] = useState<BadgeTheme>('amber_neon');

  const handleAddBulkRow = () => {
    setBulkRows([
      ...bulkRows,
      {
        id: `row-${Date.now()}`,
        vehicleNumber: '',
        phoneNumber: applySamePhone ? bulkPrimaryPhone : '',
        alternatePhone: '',
        vehicleModel: '',
        vehicleType: 'car',
      },
    ]);
  };

  const handleRemoveBulkRow = (id: string) => {
    if (bulkRows.length <= 1) return;
    setBulkRows(bulkRows.filter((r) => r.id !== id));
  };

  const handleUpdateBulkRow = (id: string, field: keyof BulkVehicleRow, value: string) => {
    setBulkRows(
      bulkRows.map((row) => {
        if (row.id === id) {
          if (field === 'vehicleNumber') {
            return { ...row, [field]: formatVehicleNumber(value) };
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleToggleSamePhone = (checked: boolean) => {
    setApplySamePhone(checked);
    if (checked && bulkPrimaryPhone) {
      setBulkRows(
        bulkRows.map((r) => ({
          ...r,
          phoneNumber: bulkPrimaryPhone,
        }))
      );
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleInput.vehicleNumber || !singleInput.phoneNumber) {
      alert('Please enter both Vehicle Number and Mobile Number');
      return;
    }

    setLoading(true);
    setSuccessCount(null);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleInput),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        onTagsCreated([data.tag]);
        setSuccessCount(1);
        setSingleInput({
          vehicleNumber: '',
          phoneNumber: '',
          alternatePhone: '',
          ownerName: '',
          vehicleModel: '',
          vehicleType: 'car',
          badgeTheme: 'amber_neon',
          statusMessage: '',
        });
      } else {
        alert(data.error || 'Failed to create scanner tag');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating tag');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = bulkRows.filter((r) => r.vehicleNumber.trim() && (r.phoneNumber.trim() || bulkPrimaryPhone.trim()));
    if (validRows.length === 0) {
      alert('Please fill out at least one vehicle with vehicle number and mobile number.');
      return;
    }

    setLoading(true);
    setSuccessCount(null);
    try {
      const items: CreateTagInput[] = validRows.map((r) => ({
        vehicleNumber: r.vehicleNumber,
        phoneNumber: r.phoneNumber.trim() || bulkPrimaryPhone.trim(),
        alternatePhone: r.alternatePhone?.trim(),
        ownerName: bulkOwnerName || 'Car Owner',
        vehicleModel: r.vehicleModel || 'Vehicle',
        vehicleType: r.vehicleType,
        badgeTheme: bulkTheme,
      }));

      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success && data.tags) {
        onTagsCreated(data.tags);
        setSuccessCount(data.tags.length);
        setBulkRows([
          {
            id: `row-${Date.now()}-1`,
            vehicleNumber: '',
            phoneNumber: '',
            vehicleModel: '',
            vehicleType: 'car',
          },
          {
            id: `row-${Date.now()}-2`,
            vehicleNumber: '',
            phoneNumber: '',
            vehicleModel: '',
            vehicleType: 'suv',
          },
        ]);
      } else {
        alert(data.error || 'Failed to create bulk tags');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating bulk tags');
    } finally {
      setLoading(false);
    }
  };

  const livePreviewTag: VehicleTag = {
    id: 'PP-PREVIEW',
    vehicleNumber: singleInput.vehicleNumber ? formatVehicleNumber(singleInput.vehicleNumber) : 'DL 01 AB 1234',
    phoneNumber: singleInput.phoneNumber || '+91 98765 43210',
    ownerName: singleInput.ownerName || 'Car Owner',
    vehicleModel: singleInput.vehicleModel || 'Hyundai Creta',
    vehicleType: singleInput.vehicleType || 'car',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0,
    badgeTheme: singleInput.badgeTheme || 'amber_neon',
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Instant eTag Studio
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Generate Smart Vehicle QR Tag
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Pair your car plate number with your mobile number. Real phone numbers are 100% masked on scan.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setMode('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'single'
                ? 'bg-yellow-400 text-black glow-yellow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            Single Vehicle Tag
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'bulk'
                ? 'bg-yellow-400 text-black glow-yellow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Multi-Car Batch (2–3+ Tags)
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successCount !== null && (
        <div className="my-6 p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between gap-3 text-emerald-300 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm text-white">
                Generated {successCount} Smart Car Tag{successCount > 1 ? 's' : ''}!
              </div>
              <div className="text-xs text-emerald-400 mt-0.5">
                Saved to your garage below. You can print, download sticker PNGs, or test the masked scan link now.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSuccessCount(null)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE TAG GENERATOR */}
      {mode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6 relative z-10 items-center">
          {/* Form */}
          <form onSubmit={handleSingleSubmit} className="lg:col-span-7 space-y-5">
            {/* Vehicle Number Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Vehicle Registration Number *</span>
                <span className="text-[10px] text-yellow-400 font-mono">e.g. DL 01 AB 1234 / MH 02 CD 5678</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="ENTER VEHICLE NUMBER"
                  value={singleInput.vehicleNumber}
                  onChange={(e) =>
                    setSingleInput({ ...singleInput, vehicleNumber: formatVehicleNumber(e.target.value) })
                  }
                  className="w-full bg-slate-900 border-2 border-slate-700 focus:border-yellow-400 rounded-2xl px-4 py-3.5 text-xl font-mono font-black text-yellow-400 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-yellow-400/10 uppercase transition tracking-wider shadow-inner"
                />
                <div className="absolute right-3.5 top-3.5 px-2.5 py-1 rounded bg-blue-900 text-white font-black text-[10px] font-mono tracking-wider">
                  IND
                </div>
              </div>
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">
                  Owner Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={singleInput.phoneNumber}
                    onChange={(e) => setSingleInput({ ...singleInput, phoneNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-400 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Zero Number Leak • Always Masked
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">
                  Alternate Phone <span className="text-slate-500 font-normal">(Optional Backup)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+91 98111 22334"
                    value={singleInput.alternatePhone}
                    onChange={(e) => setSingleInput({ ...singleInput, alternatePhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-400 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Model & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">
                  Vehicle Model / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyundai Creta (White)"
                  value={singleInput.vehicleModel}
                  onChange={(e) => setSingleInput({ ...singleInput, vehicleModel: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">
                  Vehicle Type
                </label>
                <select
                  value={singleInput.vehicleType}
                  onChange={(e) =>
                    setSingleInput({ ...singleInput, vehicleType: e.target.value as VehicleType })
                  }
                  className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none transition capitalize shadow-inner"
                >
                  <option value="car">Car / Sedan</option>
                  <option value="suv">SUV / MUV</option>
                  <option value="ev">Electric Vehicle (EV)</option>
                  <option value="bike">Motorcycle / Scooter</option>
                </select>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-200 mb-2">
                Sticker Badge Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'amber_neon', name: 'Gold / Amber', color: 'border-yellow-400 bg-yellow-400/10' },
                  { id: 'dark_carbon', name: 'Dark Carbon', color: 'border-slate-600 bg-slate-900' },
                  { id: 'cyber_cyan', name: 'Cyber Cyan', color: 'border-cyan-400 bg-cyan-950/40' },
                  { id: 'clean_white', name: 'Clean White', color: 'border-slate-300 bg-white text-black' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSingleInput({ ...singleInput, badgeTheme: t.id as BadgeTheme })}
                    className={`p-2.5 rounded-xl border-2 text-xs font-black text-center transition-all ${
                      singleInput.badgeTheme === t.id
                        ? 'ring-2 ring-yellow-400 border-yellow-400 text-white glow-yellow'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    } ${t.color}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base tracking-wide glow-yellow transition transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Smart Car Tag (Free)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Live Preview Side */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              Live Sticker Badge Preview
            </div>
            <PrintableBadge
              tag={livePreviewTag}
              onThemeChange={(newTheme) => setSingleInput({ ...singleInput, badgeTheme: newTheme })}
            />
          </div>
        </div>
      )}

      {/* BULK / MULTI-CAR BATCH GENERATOR */}
      {mode === 'bulk' && (
        <form onSubmit={handleBulkSubmit} className="pt-6 space-y-6 relative z-10">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-400" />
                  Multi-Car Batch Setup (Family / Fleet)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate multiple tags at once for 2, 3, or more family vehicles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Family Name (e.g. Rahul)"
                  value={bulkOwnerName}
                  onChange={(e) => setBulkOwnerName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Primary Mobile Number"
                  value={bulkPrimaryPhone}
                  onChange={(e) => {
                    setBulkPrimaryPhone(e.target.value);
                    if (applySamePhone) {
                      setBulkRows(bulkRows.map((r) => ({ ...r, phoneNumber: e.target.value })));
                    }
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                checked={applySamePhone}
                onChange={(e) => handleToggleSamePhone(e.target.checked)}
                className="w-4 h-4 rounded text-yellow-400 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Use same mobile number for all {bulkRows.length} vehicles</span>
            </label>
          </div>

          <div className="space-y-3">
            {bulkRows.map((row, index) => (
              <div
                key={row.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                <span className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-yellow-400 shrink-0">
                  #{index + 1}
                </span>

                <div className="w-full md:w-48 shrink-0">
                  <input
                    type="text"
                    required
                    placeholder="Plate (e.g. DL 01 AB 1234)"
                    value={row.vehicleNumber}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-yellow-400 placeholder:text-slate-600 uppercase focus:outline-none"
                  />
                </div>

                <div className="w-full md:w-48 shrink-0">
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={row.phoneNumber}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'phoneNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="w-full md:flex-1">
                  <input
                    type="text"
                    placeholder="Model (e.g. Honda City / Creta)"
                    value={row.vehicleModel}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleModel', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="w-full md:w-36 shrink-0">
                  <select
                    value={row.vehicleType}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleType', e.target.value as VehicleType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none capitalize"
                  >
                    <option value="car">Car / Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="ev">EV</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveBulkRow(row.id)}
                  disabled={bulkRows.length <= 1}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition self-end md:self-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleAddBulkRow}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition border border-slate-700"
            >
              <Plus className="w-4 h-4 text-yellow-400" />
              + Add Another Vehicle Tag
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm glow-yellow transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate All {bulkRows.length} Smart Tags
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
