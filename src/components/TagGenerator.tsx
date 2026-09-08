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
  FileSpreadsheet
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

  // Bulk mode state (User can generate 2-3 or more scanners at a time)
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

  // Add a new row to bulk creator
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

  // Remove row
  const handleRemoveBulkRow = (id: string) => {
    if (bulkRows.length <= 1) return;
    setBulkRows(bulkRows.filter((r) => r.id !== id));
  };

  // Update specific field in bulk row
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

  // Apply same phone across all rows
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

  // Handle single form submit
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
        // Reset single form
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

  // Handle bulk form submit
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate rows
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
        // Reset bulk
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

  // Simulated preview tag for the live generator preview
  const livePreviewTag: VehicleTag = {
    id: 'PP-PREVIEW',
    vehicleNumber: singleInput.vehicleNumber ? formatVehicleNumber(singleInput.vehicleNumber) : 'DL 01 AB 1234',
    phoneNumber: singleInput.phoneNumber || '+91 98765 43210',
    ownerName: singleInput.ownerName || 'Vehicle Owner',
    vehicleModel: singleInput.vehicleModel || 'Hyundai Creta',
    vehicleType: singleInput.vehicleType || 'car',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0,
    badgeTheme: singleInput.badgeTheme || 'amber_neon',
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Scanner Generator Studio
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Smart QR Scanner
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pair your Vehicle Plate Number with a Mobile Number for privacy-masked calling & messaging.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setMode('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'single'
                ? 'bg-brand-500 text-black shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            Single Car Scanner
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'bulk'
                ? 'bg-brand-500 text-black shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Multi-Car / Batch (2-3+ Scanners)
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successCount !== null && (
        <div className="my-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">
                Successfully Generated {successCount} Smart Scanner{successCount > 1 ? 's' : ''}!
              </div>
              <div className="text-xs text-emerald-400/80">
                You can preview, download printable sticker PNGs, or test the masked scan link below.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSuccessCount(null)}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MODE 1: SINGLE CAR SCANNER GENERATOR */}
      {mode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 relative z-10">
          {/* Form Side */}
          <form onSubmit={handleSingleSubmit} className="lg:col-span-7 space-y-5">
            {/* Vehicle Number Input */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Vehicle Registration Number *</span>
                <span className="text-[10px] text-brand-400 font-mono">e.g. DL 01 AB 1234 / MH 02 CD 5678</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter Car / Vehicle Number"
                  value={singleInput.vehicleNumber}
                  onChange={(e) =>
                    setSingleInput({ ...singleInput, vehicleNumber: formatVehicleNumber(e.target.value) })
                  }
                  className="w-full bg-slate-900/90 border-2 border-slate-700 focus:border-brand-500 rounded-xl px-4 py-3 text-lg font-mono font-bold text-yellow-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 uppercase transition tracking-wider"
                />
                <div className="absolute right-3 top-3.5 px-2 py-0.5 rounded bg-yellow-400 text-black font-extrabold text-[10px] font-mono tracking-wider">
                  IND
                </div>
              </div>
            </div>

            {/* Mobile Number & Alternate Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
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
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none transition"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Kept 100% private. Masked on scan.
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Backup / Alternate Phone <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+91 98111 22334"
                    value={singleInput.alternatePhone}
                    onChange={(e) => setSingleInput({ ...singleInput, alternatePhone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Model & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Model / Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyundai Creta (White)"
                  value={singleInput.vehicleModel}
                  onChange={(e) => setSingleInput({ ...singleInput, vehicleModel: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Type
                </label>
                <select
                  value={singleInput.vehicleType}
                  onChange={(e) =>
                    setSingleInput({ ...singleInput, vehicleType: e.target.value as VehicleType })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition capitalize"
                >
                  <option value="car">Sedan / Hatchback</option>
                  <option value="suv">SUV / MUV</option>
                  <option value="ev">Electric Vehicle (EV)</option>
                  <option value="bike">Motorcycle / Scooter</option>
                  <option value="truck">Commercial / Van</option>
                </select>
              </div>
            </div>

            {/* Badge Visual Theme */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Printable Sticker Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'amber_neon', name: 'Amber Neon', color: 'border-amber-500/60 bg-amber-950/20' },
                  { id: 'dark_carbon', name: 'Dark Carbon', color: 'border-slate-600 bg-slate-900/80' },
                  { id: 'cyber_cyan', name: 'Cyber Cyan', color: 'border-cyan-500/60 bg-cyan-950/20' },
                  { id: 'clean_white', name: 'Clean White', color: 'border-slate-300 bg-slate-100 text-slate-900' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSingleInput({ ...singleInput, badgeTheme: t.id as BadgeTheme })}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all ${
                      singleInput.badgeTheme === t.id
                        ? 'ring-2 ring-brand-400 border-brand-500 text-white shadow-glow'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    } ${t.color}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking Status / Note */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Default Parking Note <span className="text-slate-500 font-normal">(Shown to passersby)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Parked for 15 mins. Please call/WhatsApp if my vehicle is blocking."
                value={singleInput.statusMessage}
                onChange={(e) => setSingleInput({ ...singleInput, statusMessage: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-black font-extrabold text-base tracking-wide shadow-glow transition transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Smart Car Scanner
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Live Preview Side */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              Live Sticker Badge Preview
            </div>
            <PrintableBadge
              tag={livePreviewTag}
              onThemeChange={(newTheme) => setSingleInput({ ...singleInput, badgeTheme: newTheme })}
            />
          </div>
        </div>
      )}

      {/* MODE 2: MULTI-CAR / BULK GENERATOR */}
      {mode === 'bulk' && (
        <form onSubmit={handleBulkSubmit} className="pt-6 space-y-6 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-400" />
                  Multi-Vehicle Batch Setup
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate multiple scanners at once (e.g. 2-3 cars for family members or fleet).
                </p>
              </div>

              {/* Owner Info Helper */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Owner Name (e.g. Rahul)"
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

            {/* Checkbox to use same phone across all cars */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1 border-t border-slate-800">
              <input
                type="checkbox"
                checked={applySamePhone}
                onChange={(e) => handleToggleSamePhone(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0"
              />
              <span>Use the same mobile number for all {bulkRows.length} vehicles (Uncheck if each car has a different driver/number)</span>
            </label>
          </div>

          {/* Vehicle Rows */}
          <div className="space-y-3">
            {bulkRows.map((row, index) => (
              <div
                key={row.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                {/* Index & Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-brand-400">
                    #{index + 1}
                  </span>
                </div>

                {/* Car Number */}
                <div className="w-full md:w-48 shrink-0">
                  <input
                    type="text"
                    required
                    placeholder="Car Plate (e.g. DL 01 AB 1234)"
                    value={row.vehicleNumber}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-yellow-400 placeholder:text-slate-600 uppercase focus:outline-none"
                  />
                </div>

                {/* Mobile Number for this car */}
                <div className="w-full md:w-48 shrink-0">
                  <input
                    type="tel"
                    required
                    placeholder="Car Mobile Number"
                    value={row.phoneNumber}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'phoneNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-xl px-3 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Vehicle Model */}
                <div className="w-full md:flex-1">
                  <input
                    type="text"
                    placeholder="Model (e.g. Honda City / Creta)"
                    value={row.vehicleModel}
                    onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleModel', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Vehicle Type */}
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

                {/* Delete Row Button */}
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

          {/* Add Row & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleAddBulkRow}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
            >
              <Plus className="w-4 h-4 text-brand-400" />
              + Add Another Vehicle Scanner
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 text-black font-extrabold text-sm shadow-glow transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate All {bulkRows.length} Scanners
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
