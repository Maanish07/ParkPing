'use client';

import React, { useEffect, useState } from 'react';
import { PingLog } from '@/lib/types';
import { ShieldCheck, Phone, MessageSquare, Clock, X, RefreshCw, Car } from 'lucide-react';

interface ActivityLogsModalProps {
  onClose: () => void;
}

export default function ActivityLogsModal({ onClose }: ActivityLogsModalProps) {
  const [logs, setLogs] = useState<PingLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' on ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col max-h-[85vh] shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              Live Audit Log
            </div>
            <h3 className="text-xl font-black text-white">
              Scan & Ping Activity History
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Loading activity history...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No scan or ping activity recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {log.actionType === 'call' ? (
                      <Phone className="w-5 h-5 text-amber-400" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-yellow-400 text-black">
                        {log.vehicleNumber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Tag: {log.tagId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 mt-1 font-medium">
                      {log.message}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 shrink-0 self-end sm:self-auto">
                  <div>{formatTimestamp(log.createdAt)}</div>
                  <div className="text-emerald-400 font-semibold flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Delivered (Masked)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
