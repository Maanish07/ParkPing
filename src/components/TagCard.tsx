'use client';

import React, { useState } from 'react';
import { VehicleTag, TagStatus } from '@/lib/types';
import { maskPhoneNumber } from '@/lib/mask';
import QRCodeCanvas from './QRCodeCanvas';
import { 
  Phone, 
  ExternalLink, 
  Printer, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Car, 
  Clock, 
  QrCode
} from 'lucide-react';

interface TagCardProps {
  tag: VehicleTag;
  onTagUpdated: (updated: VehicleTag) => void;
  onTagDeleted: (tagId: string) => void;
  onSelectPrint: (tag: VehicleTag) => void;
}

export default function TagCard({
  tag,
  onTagUpdated,
  onTagDeleted,
  onSelectPrint,
}: TagCardProps) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState(tag.phoneNumber);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [statusMessage, setStatusMessage] = useState(tag.statusMessage || '');

  const scanUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${tag.id}` : `/p/${tag.id}`;

  const handleSavePhone = async () => {
    if (!newPhone.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: newPhone.trim() }),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        onTagUpdated(data.tag);
        setIsEditingPhone(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: TagStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        onTagUpdated(data.tag);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveStatusMessage = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusMessage }),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        onTagUpdated(data.tag);
        setIsEditingNote(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete scanner for ${tag.vehicleNumber}?`)) {
      try {
        const res = await fetch(`/api/tags/${tag.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          onTagDeleted(tag.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = () => {
    switch (tag.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'dnd':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            DND
          </span>
        );
      case 'inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Disabled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-amber-400 transition-all shadow-md relative flex flex-col justify-between group">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
              {tag.id}
            </span>
            {getStatusBadge()}
          </div>

          <select
            value={tag.status}
            onChange={(e) => handleStatusChange(e.target.value as TagStatus)}
            disabled={isUpdating}
            className="bg-slate-50 border border-slate-200 text-[11px] text-slate-700 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="dnd">DND Mode</option>
            <option value="inactive">Disable</option>
          </select>
        </div>

        {/* Plate & QR Row */}
        <div className="flex items-start justify-between gap-4 py-4">
          <div className="flex-1 min-w-0">
            {/* Authentic Indian Plate */}
            <div className="w-full rounded-lg border-2 border-black bg-yellow-400 text-black flex items-center shadow-sm overflow-hidden">
              <div className="bg-blue-900 text-white px-1.5 py-1 text-[8px] font-black leading-none border-r border-black">
                IND
              </div>
              <div className="flex-1 py-1 px-1 text-sm font-black font-mono tracking-widest text-center">
                {tag.vehicleNumber}
              </div>
            </div>

            <div className="mt-2 text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{tag.vehicleModel || 'Vehicle'}</span>
            </div>

            {/* Linked Phone with Masking & Dynamic Edit */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-600" />
                  Linked Mobile:
                </span>
                {!isEditingPhone && (
                  <button
                    onClick={() => setShowFullPhone(!showFullPhone)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {showFullPhone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {isEditingPhone ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white border border-amber-400 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                  <button
                    onClick={handleSavePhone}
                    disabled={isUpdating}
                    className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setNewPhone(tag.phoneNumber);
                    }}
                    className="p-1 rounded-lg bg-slate-200 text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {showFullPhone ? tag.phoneNumber : maskPhoneNumber(tag.phoneNumber)}
                  </span>
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="text-[10px] text-amber-700 hover:underline font-bold flex items-center gap-0.5"
                  >
                    <Edit3 className="w-2.5 h-2.5" /> Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Miniature QR */}
          <div className="shrink-0 flex flex-col items-center bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <QRCodeCanvas value={scanUrl} size={74} level="M" />
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-tight mt-1">
              Live QR
            </span>
          </div>
        </div>

        {/* Parking Note */}
        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
          <div className="truncate flex-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Parking Note:</span>
            {isEditingNote ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  onClick={handleSaveStatusMessage}
                  className="p-1 rounded bg-emerald-600 text-white"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="text-slate-700">{tag.statusMessage || 'No note set'}</span>
            )}
          </div>
          {!isEditingNote && (
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Scan stats */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Scanned: <strong className="text-slate-900">{tag.scanCount || 0} times</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{tag.lastScannedAt ? 'Recent' : 'Ready'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200">
        <a
          href={`/p/${tag.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold transition border border-slate-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Test Scan
        </a>

        <button
          onClick={() => onSelectPrint(tag)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Badge
        </button>
      </div>
    </div>
  );
}
