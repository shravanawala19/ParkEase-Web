'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Database,
  CreditCard,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Server,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

interface StatusData {
  supabase: {
    configured: boolean;
    reachable: boolean;
    listingCount: number;
    bookingCount: number;
    error: string | null;
  };
  stripe: {
    configured: boolean;
  };
  mode: 'live' | 'simulation';
}

export default function BackendStatusIndicator() {
  const { backendMode } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setLastChecked(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Status check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const isLive = status?.mode === 'live';

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Collapsed pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold
          shadow-lg border backdrop-blur-md transition-all duration-200
          hover:scale-105 active:scale-95
          ${isLive
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700 shadow-emerald-500/15'
            : 'bg-amber-50/90 border-amber-200 text-amber-700 shadow-amber-500/15'
          }
        `}
      >
        {isLive ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        ) : (
          <Zap className="w-3.5 h-3.5 text-amber-500" />
        )}
        <span>{isLive ? 'Live Backend' : 'Demo Mode'}</span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 opacity-60" />
        ) : (
          <ChevronUp className="w-3 h-3 opacity-60" />
        )}
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className={`px-4 py-3 flex items-center justify-between ${isLive ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <div className="flex items-center gap-2">
              <Server className={`w-4 h-4 ${isLive ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="text-xs font-bold text-slate-800">
                Backend Status
              </span>
            </div>
            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="p-1 rounded-lg hover:bg-white/60 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Status rows */}
          <div className="p-3 space-y-2.5">
            {/* Supabase */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Supabase</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                ) : status?.supabase.configured ? (
                  status.supabase.reachable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[11px] font-bold text-red-600">Unreachable</span>
                    </>
                  )
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Not configured</span>
                  </>
                )}
              </div>
            </div>

            {/* Stripe */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Stripe</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                ) : status?.stripe.configured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-600">Active</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Not configured</span>
                  </>
                )}
              </div>
            </div>

            {/* Data counts (if live) */}
            {status?.supabase.reachable && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Listings in DB</span>
                  <span className="font-bold text-slate-700">{status.supabase.listingCount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="text-slate-500">Bookings in DB</span>
                  <span className="font-bold text-slate-700">{status.supabase.bookingCount}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {status?.supabase.error && (
              <div className="mt-1 p-2 bg-red-50 rounded-lg border border-red-100">
                <p className="text-[10px] text-red-600 font-mono break-all">{status.supabase.error}</p>
              </div>
            )}

            {/* Last checked */}
            {lastChecked && (
              <p className="text-[10px] text-slate-400 text-right mt-1">
                Last checked: {lastChecked}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
