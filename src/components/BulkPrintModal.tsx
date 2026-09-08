'use client';

import React, { useState } from 'react';
import { VehicleTag } from '@/lib/types';
import PrintableBadge from './PrintableBadge';
import { Printer, X, CheckSquare, Square, Layers, Sparkles } from 'lucide-react';

interface BulkPrintModalProps {
  tags: VehicleTag[];
  onClose: () => void;
}

export default function BulkPrintModal({ tags, onClose }: BulkPrintModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(tags.map((t) => t.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tags.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tags.map((t) => t.id));
    }
  };

  const selectedTags = tags.filter((t) => selectedIds.includes(t.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 flex flex-col max-h-[92vh] shadow-2xl relative">
        {/* Header (No print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 no-print">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Batch Sticker Printing Sheet
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Print Multiple Vehicle Scanners
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which car scanners to include in this print batch. Optimized for A4 / Letter sticker sheets.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              disabled={selectedTags.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95 disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              Print Sheet ({selectedTags.length} Badges)
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selection Checkboxes (No print) */}
        <div className="py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 no-print">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-bold hover:text-slate-950 hover:bg-slate-200 transition"
          >
            {selectedIds.length === tags.length ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            Select All ({tags.length})
          </button>

          <div className="flex flex-wrap items-center gap-2 max-h-24 overflow-y-auto">
            {tags.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleSelect(t.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>{t.vehicleNumber}</span>
                  <span className="text-[10px] opacity-75 font-mono">({t.id})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Printable Grid Area */}
        <div className="flex-1 overflow-y-auto py-6">
          {selectedTags.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No vehicle scanners selected. Please check at least one above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {selectedTags.map((tag) => (
                <div key={tag.id} className="relative group">
                  <PrintableBadge tag={tag} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
