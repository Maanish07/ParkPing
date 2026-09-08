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
  Car, 
  Lightbulb, 
  BellRing, 
  AlertTriangle, 
  Lock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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

  const getAlertIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-amber-600" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'ShieldAlert':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'BellRing':
        return <BellRing className="w-5 h-5 text-rose-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'MessageSquare':
      default:
        return <MessageSquare className="w-5 h-5 text-amber-600" />;
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
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessageSent(true);
        if (data.whatsappUrl) {
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 selection:bg-amber-400 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between py-3 relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-black font-black text-sm flex items-center justify-center shadow-md">
            PP
          </div>
          <div>
            <div className="font-black text-base tracking-wider uppercase flex items-center gap-1 text-slate-950">
              PARKPING
            </div>
            <div className="text-[10px] text-amber-700 uppercase tracking-widest font-extrabold">
              VEHICLE SAMPARK PORTAL
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          Masked Contact
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md my-4 space-y-4 relative z-10">
        {/* Vehicle Identity Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center relative overflow-hidden">
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {tag.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Owner Reachable & Active
              </span>
            )}
            {tag.status === 'dnd' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                DND • Leave a Message
              </span>
            )}
            {tag.status === 'inactive' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Tag Inactive / Disabled
              </span>
            )}
          </div>

          {/* Authentic Indian Number Plate */}
          <div className="my-2 inline-block w-full max-w-xs">
            <div className="w-full rounded-xl border-2 border-black bg-yellow-400 text-black flex items-center shadow-md overflow-hidden">
              <div className="bg-blue-900 text-white px-2.5 py-2.5 flex flex-col items-center justify-center text-[10px] font-black leading-none border-r border-black">
                <span>I</span>
                <span>N</span>
                <span>D</span>
              </div>
              <div className="flex-1 py-2 px-3 text-2xl sm:text-3xl font-black font-mono tracking-widest text-center">
                {tag.vehicleNumber}
              </div>
            </div>
          </div>

          {/* Vehicle Model & Masked Phone */}
          <div className="text-sm font-semibold text-slate-700 mt-2 flex items-center justify-center gap-2">
            <Car className="w-4 h-4 text-amber-600" />
            <span>{tag.vehicleModel || 'Vehicle'}</span>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Owner Contact: <strong className="font-mono text-slate-900">{tag.maskedPhone}</strong></span>
          </div>

          {/* Parking Note */}
          {tag.statusMessage && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              &ldquo;{tag.statusMessage}&rdquo;
            </div>
          )}
        </div>

        {/* Action 1: Masked Voice Call Button */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Direct Call Connection</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Number Masked
            </span>
          </div>

          <button
            onClick={handleInitiateCall}
            disabled={tag.status === 'inactive'}
            className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide glow-yellow transition flex items-center justify-center gap-2.5 active:scale-95 shadow-md disabled:opacity-40"
          >
            <Phone className="w-4 h-4" />
            <span>Call Vehicle Owner (Private Relay)</span>
          </button>
          <div className="text-[11px] text-slate-500 text-center font-medium">
            Your call is routed through our virtual server. Your personal number is never shared.
          </div>
        </div>

        {/* Action 2: 1-Click WhatsApp Emergency Alerts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>1-Click WhatsApp Alerts</span>
            <span className="text-[10px] text-slate-400 font-medium">Tap to dispatch</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ALERTS.map((alert) => {
              const isSelected = selectedAlert.id === alert.id;
              return (
                <button
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    if (alert.id !== 'custom') {
                      setCustomText(alert.defaultMessage);
                    } else {
                      setCustomText('');
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {getAlertIcon(alert.iconName)}
                    {alert.urgency === 'high' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900">{alert.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">
                    {alert.shortDesc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Message Content (Can be edited):
            </label>
            <textarea
              rows={2}
              value={customText || selectedAlert.defaultMessage}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-900 focus:outline-none transition resize-none font-medium"
              placeholder="Type your urgent message to the owner..."
            />
          </div>

          {/* WhatsApp Dispatch Button */}
          <button
            onClick={handleSendAlert}
            disabled={sendingMessage || tag.status === 'inactive'}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs glow-emerald transition flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-40"
          >
            {sendingMessage ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch 1-Click WhatsApp Alert</span>
              </>
            )}
          </button>

          {messageSent && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 animate-fadeIn flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>WhatsApp Alert Prepared & Opened!</span>
            </div>
          )}
        </div>
      </main>

      {/* Simulated Masked Call Modal */}
      {isCalling && (
        <MaskedCallModal
          vehicleNumber={tag.vehicleNumber}
          maskedPhone={tag.maskedPhone}
          onClose={() => setIsCalling(false)}
        />
      )}

      {/* Footer */}
      <footer className="w-full max-w-md py-4 text-center text-xs text-slate-500">
        <p>Protected by <strong>ParkPing Privacy Shield</strong></p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Want a smart privacy tag for your car? <Link href="/" className="text-amber-600 font-bold hover:underline">Get ParkPing Tag</Link>
        </p>
      </footer>
    </div>
  );
}
