'use client';

import React, { useRef, useState, useEffect } from 'react';
import QRCodeCanvas from './QRCodeCanvas';
import { VehicleTag, BadgeTheme } from '@/lib/types';
import { ShieldCheck, QrCode, Download, Printer, Radio, Car, Sparkles, Check } from 'lucide-react';

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
      // Find the canvas inside the badge
      const canvas = badgeRef.current?.querySelector('canvas');
      if (!canvas) {
        alert('Could not capture QR badge image');
        return;
      }

      // Create a high-res composite canvas
      const compCanvas = document.createElement('canvas');
      const ctx = compCanvas.getContext('2d');
      if (!ctx) return;

      compCanvas.width = 600;
      compCanvas.height = 760;

      // Background
      if (theme === 'dark_carbon') {
        ctx.fillStyle = '#0f172a';
      } else if (theme === 'clean_white') {
        ctx.fillStyle = '#ffffff';
      } else if (theme === 'cyber_cyan') {
        ctx.fillStyle = '#082f49';
      } else {
        ctx.fillStyle = '#1c1917'; // amber neon
      }
      ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);

      // Border
      ctx.lineWidth = 8;
      ctx.strokeStyle = theme === 'clean_white' ? '#0f172a' : (theme === 'amber_neon' ? '#f59e0b' : '#38bdf8');
      ctx.strokeRect(10, 10, compCanvas.width - 20, compCanvas.height - 20);

      // Header Text
      ctx.fillStyle = theme === 'clean_white' ? '#0f172a' : '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PARKPING', compCanvas.width / 2, 70);

      ctx.fillStyle = theme === 'clean_white' ? '#64748b' : '#94a3b8';
      ctx.font = '600 16px sans-serif';
      ctx.fillText('SMART VEHICLE CONTACT TAG', compCanvas.width / 2, 100);

      // Draw QR Code centered
      const qrSize = 340;
      const qrX = (compCanvas.width - qrSize) / 2;
      const qrY = 130;

      // Draw white card backing for QR to ensure 100% scan reliability in sunlight
      ctx.fillStyle = '#ffffff';
      ctx.roundRect ? ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 16) : ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
      ctx.fill();

      ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

      // Vehicle Plate
      const plateY = 540;
      ctx.fillStyle = '#facc15';
      ctx.fillRect(50, plateY, 500, 70);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(50, plateY, 500, 70);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(tag.vehicleNumber, compCanvas.width / 2, plateY + 48);

      // Instructions
      ctx.fillStyle = theme === 'clean_white' ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('SCAN WITH PHONE TO CALL / PING OWNER', compCanvas.width / 2, 655);

      ctx.fillStyle = theme === 'clean_white' ? '#64748b' : '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Tag ID: ${tag.id} • Privacy Protected by ParkPing`, compCanvas.width / 2, 690);

      // Trigger download
      const link = document.createElement('a');
      link.download = `ParkPing_${tag.vehicleNumber.replace(/\s+/g, '_')}_${tag.id}.png`;
      link.href = compCanvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark_carbon':
        return {
          wrapper: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border-slate-700 text-white shadow-2xl',
          headerBg: 'bg-slate-800/80 border-slate-700 text-slate-200',
          accentColor: '#38bdf8',
          accentText: 'text-cyan-400',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'cyber_cyan':
        return {
          wrapper: 'bg-gradient-to-b from-cyan-950 via-slate-950 to-slate-900 border-cyan-500/50 text-white shadow-glow-cyan',
          headerBg: 'bg-cyan-900/40 border-cyan-500/30 text-cyan-200',
          accentColor: '#06b6d4',
          accentText: 'text-cyan-400',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'clean_white':
        return {
          wrapper: 'bg-white border-slate-300 text-slate-900 shadow-xl',
          headerBg: 'bg-slate-100 border-slate-200 text-slate-700',
          accentColor: '#0f172a',
          accentText: 'text-slate-900',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
      case 'amber_neon':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-stone-900 via-neutral-950 to-black border-amber-500/50 text-white shadow-glow',
          headerBg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
          accentColor: '#f59e0b',
          accentText: 'text-amber-400',
          badgePlate: 'bg-yellow-400 text-black border-black',
        };
    }
  };

  const currentStyle = getThemeStyles();

  return (
    <div className="flex flex-col items-center">
      {/* Theme Selector (only if not compact and onThemeChange provided) */}
      {!compact && onThemeChange && (
        <div className="flex items-center gap-2 mb-4 p-1.5 rounded-full bg-slate-900/80 border border-slate-800 no-print">
          {(['amber_neon', 'dark_carbon', 'cyber_cyan', 'clean_white'] as BadgeTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeSelect(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all capitalize ${
                theme === t
                  ? 'bg-brand-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* The Printable Badge Card */}
      <div
        ref={badgeRef}
        className={`printable-sticker-wrapper relative w-[290px] sm:w-[320px] rounded-2xl border-2 p-5 flex flex-col items-center text-center transition-all ${currentStyle.wrapper}`}
      >
        {/* Brand Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow">
              PP
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider uppercase flex items-center gap-1">
                ParkPing
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Smart Vehicle Tag
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
            {tag.id}
          </div>
        </div>

        {/* QR Code Backing */}
        <div className="bg-white p-3 rounded-xl shadow-inner my-2 flex flex-col items-center">
          <QRCodeCanvas
            value={scanUrl}
            size={compact ? 170 : 190}
            fgColor="#000000"
            bgColor="#ffffff"
            level="H"
          />
          <div className="text-[9px] font-bold text-slate-700 tracking-wider uppercase mt-1">
            Scan to ping owner
          </div>
        </div>

        {/* Vehicle Registration Plate */}
        <div className="w-full my-3">
          <div className={`w-full py-2 px-3 rounded-lg border-2 plate-font text-xl sm:text-2xl font-black text-center shadow-md ${currentStyle.badgePlate}`}>
            {tag.vehicleNumber}
          </div>
          {tag.vehicleModel && (
            <div className="text-[11px] font-medium text-slate-400 mt-1 truncate">
              {tag.vehicleModel}
            </div>
          )}
        </div>

        {/* Instructions & Privacy Guarantee */}
        <div className="w-full pt-2 border-t border-white/10 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Privacy Leak • Masked Call & SMS</span>
          </div>
          <div className="text-[9px] text-slate-400 tracking-tight">
            Point camera at QR code • No app download required
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      {!compact && (
        <div className="flex items-center gap-3 mt-4 no-print">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition shadow"
          >
            <Download className="w-4 h-4 text-brand-400" />
            {downloading ? 'Generating PNG...' : 'Download Sticker PNG'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-400 text-black transition shadow-glow font-extrabold"
          >
            <Printer className="w-4 h-4" />
            Print Badge
          </button>
        </div>
      )}
    </div>
  );
}
