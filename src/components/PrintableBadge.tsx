'use client';

import React, { useRef, useState, useEffect } from 'react';
import QRCodeCanvas from './QRCodeCanvas';
import { VehicleTag, BadgeTheme } from '@/lib/types';
import { ShieldCheck, Download, Printer, Car, Sparkles, Phone, Lock, Zap } from 'lucide-react';

interface PrintableBadgeProps {
  tag: VehicleTag;
  scanBaseUrl?: string;
  onThemeChange?: (theme: BadgeTheme) => void;
  compact?: boolean;
}

export default function PrintableBadge({
  tag,
  scanBaseUrl = '',
  onThemeChange,
  compact = false,
}: PrintableBadgeProps) {
  const [currentOrigin, setCurrentOrigin] = useState('');
  const [theme, setTheme] = useState<BadgeTheme>(tag.badgeTheme || 'amber_neon');
  const [downloading, setDownloading] = useState(false);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const effectiveBaseUrl = scanBaseUrl || currentOrigin || 'https://parkping.app';
  const scanUrl = `${effectiveBaseUrl}/p/${tag.id}`;

  const handleThemeSelect = (newTheme: BadgeTheme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = badgeRef.current?.querySelector('canvas');
      if (!canvas) return;

      const compCanvas = document.createElement('canvas');
      const ctx = compCanvas.getContext('2d');
      if (!ctx) return;

      compCanvas.width = 640;
      compCanvas.height = 800;

      // Background
      if (theme === 'dark_carbon') {
        ctx.fillStyle = '#0f172a';
      } else if (theme === 'clean_white') {
        ctx.fillStyle = '#ffffff';
      } else if (theme === 'cyber_cyan') {
        ctx.fillStyle = '#082f49';
      } else {
        ctx.fillStyle = '#171717'; // Yellow Gold / Amber
      }
      ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);

      // Gold / Color border
      ctx.lineWidth = 10;
      ctx.strokeStyle = theme === 'clean_white' ? '#0f172a' : (theme === 'amber_neon' ? '#facc15' : '#38bdf8');
      ctx.strokeRect(12, 12, compCanvas.width - 24, compCanvas.height - 24);

      // Header Brand
      ctx.fillStyle = theme === 'clean_white' ? '#0f172a' : '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PARKPING', compCanvas.width / 2, 70);

      ctx.fillStyle = theme === 'clean_white' ? '#475569' : '#facc15';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('SMART VEHICLE CONTACT TAG', compCanvas.width / 2, 100);

      // White QR Box
      const qrSize = 340;
      const qrX = (compCanvas.width - qrSize) / 2;
      const qrY = 135;

      ctx.fillStyle = '#ffffff';
      ctx.roundRect ? ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 16) : ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
      ctx.fill();

      ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

      // Plate Box
      const plateY = 560;
      ctx.fillStyle = '#facc15';
      ctx.fillRect(40, plateY, 560, 76);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(40, plateY, 560, 76);

      // IND strip
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(40, plateY, 54, 76);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('IND', 67, plateY + 46);

      // Plate Text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 38px monospace';
      ctx.fillText(tag.vehicleNumber, compCanvas.width / 2 + 20, plateY + 52);

      // Footer Instructions
      ctx.fillStyle = theme === 'clean_white' ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('SCAN WITH CAMERA TO CALL OWNER PRIVATELY', compCanvas.width / 2, 690);

      ctx.fillStyle = theme === 'clean_white' ? '#64748b' : '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Tag ID: ${tag.id} • 100% Number Masking Protected`, compCanvas.width / 2, 730);

      const link = document.createElement('a');
      link.download = `ParkPing_Tag_${tag.vehicleNumber.replace(/\s+/g, '_')}.png`;
      link.href = compCanvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark_carbon':
        return {
          wrapper: 'bg-carbon-pattern border-slate-700 text-white shadow-2xl',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'cyber_cyan':
        return {
          wrapper: 'bg-gradient-to-b from-cyan-950 via-slate-950 to-slate-900 border-cyan-500/50 text-white shadow-glow-cyan',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'clean_white':
        return {
          wrapper: 'bg-white border-slate-300 text-slate-900 shadow-2xl',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'amber_neon':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-neutral-900 via-stone-950 to-black border-yellow-500/60 text-white glow-yellow',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
    }
  };

  const currentStyle = getThemeStyles();

  return (
    <div className="flex flex-col items-center">
      {/* Theme Pills */}
      {!compact && onThemeChange && (
        <div className="flex items-center gap-1.5 mb-4 p-1 rounded-full bg-slate-100 border border-slate-200 no-print shadow-sm">
          {(['amber_neon', 'dark_carbon', 'cyber_cyan', 'clean_white'] as BadgeTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeSelect(t)}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all capitalize ${
                theme === t
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* The Physical Sticker Badge */}
      <div
        ref={badgeRef}
        className={`printable-sticker-wrapper sticker-gloss relative w-[290px] sm:w-[320px] rounded-3xl border-2 p-5 flex flex-col items-center text-center transition-all ${currentStyle.wrapper}`}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-2">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-black font-black text-sm flex items-center justify-center shadow">
              PP
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider uppercase flex items-center gap-1 text-white">
                PARKPING
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-yellow-400 uppercase tracking-widest font-extrabold">
                SMART VEHICLE TAG
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-white/10 text-slate-300">
            {tag.id}
          </div>
        </div>

        {/* QR Code Container with High-Contrast White Background */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xl my-2 flex flex-col items-center border border-slate-200">
          <QRCodeCanvas
            value={scanUrl}
            size={compact ? 170 : 190}
            fgColor="#000000"
            bgColor="#ffffff"
            level="H"
          />
          <div className="text-[9px] font-black text-slate-800 tracking-wider uppercase mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            SCAN WITH CAMERA TO CALL OWNER
          </div>
        </div>

        {/* Authentic Indian Plate Look */}
        <div className="w-full my-2.5">
          <div className="w-full rounded-xl border-2 border-black bg-yellow-400 text-black flex items-center shadow-lg overflow-hidden">
            <div className="bg-blue-900 text-white px-2 py-2 flex flex-col items-center justify-center text-[9px] font-black leading-none border-r border-black">
              <span>I</span>
              <span>N</span>
              <span>D</span>
            </div>
            <div className="flex-1 py-1.5 px-2 text-xl sm:text-2xl font-black font-mono tracking-widest text-center">
              {tag.vehicleNumber}
            </div>
          </div>
          {tag.vehicleModel && (
            <div className="text-[11px] font-semibold text-slate-400 mt-1 truncate">
              {tag.vehicleModel}
            </div>
          )}
        </div>

        {/* Instructions & Privacy Guarantee */}
        <div className="w-full pt-2.5 border-t border-white/10 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Privacy Protected • Masked Voice & SMS</span>
          </div>
          <div className="text-[9px] text-slate-400 tracking-tight">
            No app download needed • Works with any smartphone
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!compact && (
        <div className="flex items-center gap-3 mt-4 no-print flex-wrap justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-500" />
            {downloading ? 'Downloading PNG...' : 'Download Sticker PNG'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition glow-yellow shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Badge
          </button>
        </div>
      )}
    </div>
  );
}
