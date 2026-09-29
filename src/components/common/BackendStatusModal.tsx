'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Database,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackendStatusModal({ isOpen, onClose }: BackendStatusModalProps) {
  const { isSupabaseConnected, isStripeConfigured, refreshData } = useApp();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);

  const fetchStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyEnvSnippet = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>ParkEase Architecture</span>
          </div>
          <h3 className="text-xl font-black">Backend & Cloud Integration Status</h3>
          <p className="text-slate-400 text-xs mt-1">
            Status of Supabase PostgreSQL, Authentication, Storage, and Stripe Checkout.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Supabase Status */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  Supabase Database
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSupabaseConnected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isSupabaseConnected ? 'Live Connected' : 'Simulated'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isSupabaseConnected
                  ? `Connected to Supabase PostgreSQL. Tables: profiles, listings, bookings, reviews.`
                  : `Currently running in Demo simulation mode using rich local state.`}
              </p>
            </div>

            {/* Stripe Status */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Stripe Checkout
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isStripeConfigured
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isStripeConfigured ? 'Stripe Ready' : 'Simulated Gateway'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isStripeConfigured
                  ? 'Stripe test keys loaded. Checkout sessions and webhook confirmation active.'
                  : 'Instant mock confirmation pass enabled with automatic gate PIN generator.'}
              </p>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Connect Your Free Supabase & Stripe Accounts
              </span>
              <button
                type="button"
                onClick={copyEnvSnippet}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-blue-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Add your credentials to <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold">.env.local</code> in the project root:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...<br />
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...<br />
              STRIPE_SECRET_KEY=sk_test_...
            </div>
            <div className="text-[11px] text-blue-700 flex items-center gap-4 pt-1">
              <a
                href="https://database.new"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-blue-900 flex items-center gap-1"
              >
                Create Free Supabase <ExternalLink className="w-3 h-3" />
              </a>
              <span>·</span>
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-blue-900 flex items-center gap-1"
              >
                Get Stripe Test Keys <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Database Schema SQL quick copy */}
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">
              Supabase SQL Schema & Seeds
            </span>
            <p className="text-slate-600 leading-relaxed">
              The project includes ready-to-run SQL migrations:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><code className="bg-slate-100 font-mono px-1 py-0.5 rounded text-blue-700">supabase/schema.sql</code>: Tables, RLS policies, storage bucket, triggers</li>
              <li><code className="bg-slate-100 font-mono px-1 py-0.5 rounded text-blue-700">supabase/seed.sql</code>: 6 pre-configured San Francisco spots & test bookings</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={checking}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Refresh Health Check</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
