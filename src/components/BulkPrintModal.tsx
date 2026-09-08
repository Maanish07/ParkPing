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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col max-h-[90vh] shadow-2xl relative">
        {/* Header (No print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 no-print">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Batch Sticker Printing Sheet
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Print Multiple Vehicle Scanners
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select which car scanners to include in this print batch. Optimized for A4 / Letter sticker sheets.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              disabled={selectedTags.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-glow transition active:scale-95 disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              Print Sheet ({selectedTags.length} Badges)
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selection Checkboxes (No print) */}
        <div className="py-4 border-b border-slate-800/80 flex flex-wrap items-center gap-3 no-print">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold hover:text-white"
          >
            {selectedIds.length === tags.length ? (
              <CheckSquare className="w-4 h-4 text-brand-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            Select All ({tags.length})
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleSelect(t.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
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
            <div className="text-center py-16 text-slate-500 text-sm">
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
