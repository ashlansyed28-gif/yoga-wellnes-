import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Heart } from 'lucide-react';

export default function EmergencyCalmButton({ className = '', variant = 'pill' }) {
  const navigate = useNavigate();

  if (variant === 'floating') {
    return (
      <button
        onClick={() => navigate('/calm')}
        aria-label="Activate Emergency Calm Mode"
        className={`fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group ${className}`}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Wind className="w-5 h-5 text-white/90 group-hover:rotate-12 transition-transform duration-300" />
        <span className="tracking-wide text-sm font-semibold">Emergency Calm</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate('/calm')}
      className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 overflow-hidden group ${className}`}
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
      <Heart className="w-4 h-4 fill-white/20 stroke-white transition-transform group-hover:scale-110" />
      <span>Emergency Calm Mode</span>
    </button>
  );
}
