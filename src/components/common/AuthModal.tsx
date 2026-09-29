'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User, Sparkles, Check, Car, Shield } from 'lucide-react';

export default function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    setUserRole,
    signInWithSupabase,
    signUpWithSupabase,
    isSupabaseConnected,
    showToast,
  } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(authModal.mode || 'login');
  const [selectedRole, setSelectedRole] = useState<'renter' | 'host'>('renter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModal.isOpen) return null;

  const handleDemoLogin = (role: 'renter' | 'host') => {
    setUserRole(role);
    closeAuthModal();
    showToast(
      `Welcome back, ${role === 'renter' ? 'Alex Mercer' : 'Marcus Vance'}!`,
      `Logged in with full ${role} demo privileges.`,
      'success'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await signInWithSupabase(email, password);
      setIsSubmitting(false);
      if (res.success) {
        closeAuthModal();
      }
    } else {
      const res = await signUpWithSupabase(email, password, name || 'User', selectedRole);
      setIsSubmitting(false);
      if (res.success) {
        closeAuthModal();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header pattern */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 pt-7 pb-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Car className="w-5 h-5 text-white" />
            </span>
            <span className="text-xl font-bold tracking-tight">ParkEase</span>
          </div>
          <h3 className="text-2xl font-extrabold">
            {mode === 'login' ? 'Welcome back' : 'Join ParkEase'}
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            {mode === 'login'
              ? 'Access your parking spots, bookings & earnings'
              : 'Find guaranteed parking or monetize your empty driveway'}
          </p>
        </div>

        <div className="p-6">
          {/* Demo Login Quick-Select Banner */}
          <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Instant 1-Click Demo Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('renter')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl bg-white border border-blue-200 text-blue-900 hover:bg-blue-600 hover:text-white shadow-sm transition-all"
              >
                <span>🚗 Login as Renter</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('host')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl bg-white border border-blue-200 text-blue-900 hover:bg-indigo-600 hover:text-white shadow-sm transition-all"
              >
                <span>🏠 Login as Host</span>
              </button>
            </div>
          </div>

          {/* Mode switch tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role selector for signup */}
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Primary Goal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('renter')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === 'renter'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Rent a Spot
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('host')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === 'host'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Host My Space
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to email', undefined, 'info')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:shadow-none mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In to ParkEase' : 'Create Free Account'}</span>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span>{isSupabaseConnected ? 'Supabase Live Auth Active' : 'Demo Simulation Mode (Instant Login)'}</span>
            </div>
          </form>

          {/* Social login buttons */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white text-xs text-slate-400">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('renter')}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('renter')}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.18.66-2.88 1.48-.56.65-1.05 1.76-.92 2.81 1.11.09 2.22-.56 2.84-1.34z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            By signing up, you agree to ParkEase's{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
