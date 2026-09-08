'use client';

import React, { useState } from 'react';
import { QuickAlertTemplate, AlertType } from '@/lib/types';
import { QUICK_ALERTS } from '@/lib/templates';
import MaskedCallModal from './MaskedCallModal';
import { 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  Car, 
  Lightbulb, 
  BellRing, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PublicTagData {
  id: string;
  vehicleNumber: string;
  vehicleModel?: string;
  vehicleType: string;
  status: 'active' | 'dnd' | 'inactive';
  statusMessage?: string;
  badgeTheme?: string;
  maskedPhone: string;
  maskedAlternate?: string;
  hasAlternate?: boolean;
}

interface PasserbyScanViewProps {
  tag: PublicTagData;
}

export default function PasserbyScanView({ tag }: PasserbyScanViewProps) {
  const [selectedAlert, setSelectedAlert] = useState<QuickAlertTemplate>(QUICK_ALERTS[0]);
  const [customText, setCustomText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [senderContact, setSenderContact] = useState('');

  // Icon selector helper
  const getAlertIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-amber-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'ShieldAlert':
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'BellRing':
        return <BellRing className="w-5 h-5 text-rose-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'MessageSquare':
      default:
        return <MessageSquare className="w-5 h-5 text-brand-400" />;
    }
  };

  const handleSendAlert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSendingMessage(true);

    const messageContent = selectedAlert.id === 'custom' 
      ? customText 
      : (customText || selectedAlert.defaultMessage);

    try {
      const res = await fetch(`/api/tags/${tag.id}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: selectedAlert.id,
          message: messageContent,
          actionType: 'whatsapp',
          senderPhone: senderContact,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessageSent(true);
        if (data.whatsappUrl) {
          // Open WhatsApp in new tab / app
          window.open(data.whatsappUrl, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error sending alert');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleInitiateCall = async () => {
    try {
      await fetch(`/api/tags/${tag.id}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: 'custom',
          message: 'Incoming masked voice call from passerby',
          actionType: 'call',
        }),
      });
    } catch (e) {
      console.error(e);
    }
    setIsCalling(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 selection:bg-brand-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between py-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-glow">
            PP
          </div>
          <div>
            <div className="font-black text-base tracking-wider uppercase flex items-center gap-1 text-white">
              ParkPing
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Vehicle Contact Portal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Masked Shield
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md my-4 space-y-4 relative z-10">
        {/* Vehicle Identity Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl text-center relative overflow-hidden">
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {tag.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Owner Reachable & Active
              </span>
            )}
            {tag.status === 'dnd' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                DND • Leave a Message
              </span>
            )}
            {tag.status === 'inactive' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                Tag Inactive / Disabled
              </span>
            )}
          </div>

          {/* Vehicle Number Plate */}
          <div className="my-2 inline-block">
            <div className="bg-yellow-400 text-black border-2 border-black font-black plate-font text-2xl sm:text-3xl px-5 py-2 rounded-xl shadow-lg">
              {tag.vehicleNumber}
            </div>
          </div>

          {/* Vehicle Model & Masked Phone */}
          <div className="text-sm font-semibold text-slate-300 mt-2 flex items-center justify-center gap-2">
            <Car className="w-4 h-4 text-brand-400" />
            <span>{tag.vehicleModel || 'Vehicle'}</span>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Owner Contact: <strong className="font-mono text-white">{tag.maskedPhone}</strong></span>
          </div>

          {/* Parking Note if set */}
          {tag.statusMessage && (
            <div className="mt-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 font-medium">
              &ldquo;{tag.statusMessage}&rdquo;
            </div>
          )}
        </div>

        {/* Action 1: Masked Voice Call Button */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-black font-bold shadow-glow shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                Call Vehicle Owner
              </div>
              <div className="text-[11px] text-slate-400">
                Direct masked relay • No phone number shared
              </div>
            </div>
          </div>

          <button
            onClick={handleInitiateCall}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-glow transition active:scale-95 shrink-0"
          >
            Call Now
          </button>
        </div>

        {/* Action 2: Quick Masked Alert Messages */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              Send 1-Click Alert Message
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              WhatsApp / SMS Bridge
            </span>
          </div>

          {/* Quick Alert Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ALERTS.map((alert) => {
              const isSelected = selectedAlert.id === alert.id;
              return (
                <button
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    setMessageSent(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-brand-500/20 to-amber-500/10 border-brand-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getAlertIcon(alert.iconName)}
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      {alert.label}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {alert.shortDesc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message Preview & Custom Edit Box */}
          <form onSubmit={handleSendAlert} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Message Content:
              </label>
              <textarea
                rows={2}
                value={selectedAlert.id === 'custom' ? customText : (customText || selectedAlert.defaultMessage)}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your urgent message..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition resize-none"
              />
            </div>

            {/* Submit Alert Button */}
            <button
              type="submit"
              disabled={sendingMessage}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-sm shadow-glow-emerald transition active:scale-95 flex items-center justify-center gap-2"
            >
              {sendingMessage ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send &ldquo;{selectedAlert.label}&rdquo; to Owner
                </>
              )}
            </button>
          </form>

          {/* Message Success Banner */}
          {messageSent && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Alert dispatched via ParkPing WhatsApp Relay. Owner notified!</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Privacy Guarantee */}
      <footer className="w-full max-w-md text-center py-4 text-slate-500 text-[11px] relative z-10">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Powered by ParkPing Privacy Shield</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-600">
          Both your number and the car owner&apos;s number are masked to prevent spam and harassment.
        </p>
      </footer>

      {/* Masked Call Interactive Modal */}
      {isCalling && (
        <MaskedCallModal
          vehicleNumber={tag.vehicleNumber}
          maskedPhone={tag.maskedPhone}
          onClose={() => setIsCalling(false)}
        />
      )}
    </div>
  );
}
