import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flame, 
  Clock, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  PieChart,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';
import WeeklyChart from '../components/WeeklyChart';
import ProgressRing from '../components/ProgressRing';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function ProgressPage() {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.getSessionHistory();
      if (res?.success) {
        setHistoryData(res);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalMins = historyData?.total_minutes || 45;
  const totalSessions = historyData?.total_sessions || 4;
  const breakdown = historyData?.breakdown || {
    Yoga: 15,
    Meditation: 10,
    Breathing: 10,
    'Face Yoga': 5,
    Sleep: 5
  };
  const badges = historyData?.badges || [];
  const sessions = historyData?.sessions || [];

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
          Personalized Wellness Tracker
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Your Mindful Journey & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Every intentional breath and restorative posture builds cumulative resilience. Track your practice consistency and celebrated milestones.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            3 <span className="text-sm font-sans font-medium text-stone-500">Days</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Consistent daily rhythm</span>
        </div>

        <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase">
            <span>Total Mindful Time</span>
            <Clock className="w-4 h-4 text-sage-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            {totalMins} <span className="text-sm font-sans font-medium text-stone-500">Minutes</span>
          </div>
          <span className="text-[11px] text-stone-500">Logged across all disciplines</span>
        </div>

        <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase">
            <span>Sessions Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            {totalSessions} <span className="text-sm font-sans font-medium text-stone-500">Sessions</span>
          </div>
          <span className="text-[11px] text-stone-500">Yoga, breath & stillness</span>
        </div>

        <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase">
            <span>Weekly Target</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            75% <span className="text-sm font-sans font-medium text-stone-500">Paced</span>
          </div>
          <span className="text-[11px] text-sage-700 font-medium">On track for weekly harmony</span>
        </div>
      </div>

      {/* Grid: Consistency Chart & Domain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="zen-glass p-6 sm:p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            7-Day Practice Consistency
          </h3>
          <p className="text-xs text-stone-500">Daily practice minutes invested in mindful well-being</p>
          <WeeklyChart />
        </div>

        {/* Practice Breakdown Ring */}
        <div className="zen-glass p-6 sm:p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-6">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Wellness Discipline Distribution
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(breakdown).map(([type, mins]) => (
              <div key={type} className="p-3 rounded-2xl bg-white border border-sage-200/70 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block truncate">
                  {type}
                </span>
                <span className="font-serif text-xl font-bold text-sage-900 mt-0.5 block">
                  {mins}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones & Badges Showcase */}
      <div className="zen-glass p-6 sm:p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Unlocked Milestones & Badges
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Gamified wellness badges earned through dedicated consistent practice.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-3xl border text-center flex flex-col items-center justify-between transition-all ${
                b.unlocked
                  ? 'bg-white border-sage-300 subtle-shadow'
                  : 'bg-sand-100/50 border-stone-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-sage-50 flex items-center justify-center text-2xl mb-2">
                {b.icon}
              </div>
              <h4 className="font-serif text-xs font-bold text-stone-900 leading-snug">
                {b.title}
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                {b.description}
              </p>
              <span
                className={`text-[9px] uppercase tracking-wider font-bold mt-2 px-2 py-0.5 rounded-full ${
                  b.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {b.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Session History Log */}
      <div className="zen-glass p-6 sm:p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-4">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Recent Completed Sessions
        </h3>

        <div className="space-y-2.5">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl bg-white border border-sage-200/80 flex items-center justify-between text-xs text-stone-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center text-xs">
                  {s.session_type[0]}
                </div>
                <div>
                  <strong className="block text-stone-900">{s.session_type} Practice</strong>
                  <span className="text-[11px] text-stone-500">
                    {new Date(s.completed_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-sage-900">{s.duration_minutes} mins</span>
                <span className="text-[10px] text-emerald-700 block">Logged</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
