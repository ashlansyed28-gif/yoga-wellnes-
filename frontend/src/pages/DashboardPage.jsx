import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Wind, 
  Camera, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Calendar, 
  Clock, 
  Flame, 
  ArrowRight,
  Compass,
  Smile,
  Moon,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import WellnessCard from '../components/WellnessCard';
import WeeklyChart from '../components/WeeklyChart';
import ProgressRing from '../components/ProgressRing';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [planCompleted, setPlanCompleted] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      if (res?.data) {
        setDashboardData(res.data);
        setPlanCompleted(res.data.today_plan?.is_completed || false);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await api.regeneratePlan();
      if (res?.plan) {
        setDashboardData((prev) => ({
          ...prev,
          today_plan: res.plan
        }));
      }
    } catch (err) {
      console.error('Plan regeneration error:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const duration = (dashboardData?.today_plan?.yoga_minutes || 10) +
                       (dashboardData?.today_plan?.breathing_minutes || 5) +
                       (dashboardData?.today_plan?.meditation_minutes || 5);
      await api.completeSession('Yoga', duration);
      setPlanCompleted(true);
      fetchDashboard();
    } catch (err) {
      setPlanCompleted(true);
    }
  };

  // Dynamic Greeting
  const currentHour = new Date().getHours();
  let greetingTime = 'Day';
  if (currentHour < 12) greetingTime = 'Morning';
  else if (currentHour < 17) greetingTime = 'Afternoon';
  else greetingTime = 'Evening';

  const userName = dashboardData?.profile?.name || user?.name || 'Mindful Seeker';
  const todayPlan = dashboardData?.today_plan;
  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
            Namaste & Welcome
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Good {greetingTime}, <span className="text-sage-800">{userName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            "Your mind is a garden; your thoughts are the seeds. Practice brings serenity."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/calm')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-600 hover:brightness-105 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Wind className="w-4 h-4" />
            <span>Instant Emergency Calm</span>
          </button>

          <button
            onClick={() => navigate('/yoga/pose-correction')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>AI Pose Camera</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Today's AI Personalized Plan */}
      <div className="relative rounded-3xl zen-glass border border-sage-200/90 subtle-shadow p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sage-100/60 to-transparent rounded-bl-full pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sage-200/80 text-sage-900">
                <Sparkles className="w-3.5 h-3.5 text-sage-700" />
                Gemini Adaptive Daily Plan
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Today’s Mindful Restoration Ritual
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {todayPlan?.plan_summary || 'A custom restorative sequence tuned to reduce stress and open tight hips.'}
              </p>
            </div>

            {/* Time Breakdown Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs font-semibold text-sage-900">
                <span className="w-2 h-2 rounded-full bg-sage-600" />
                <span>Yoga: {todayPlan?.yoga_minutes || 10}m</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Breathing: {todayPlan?.breathing_minutes || 5}m</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Meditation: {todayPlan?.meditation_minutes || 5}m</span>
              </div>
            </div>

            {/* Recommended Routine Checklist */}
            {todayPlan?.recommended_routine && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Curated Sequence
                </span>
                <ul className="space-y-1">
                  {todayPlan.recommended_routine.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            {planCompleted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="font-semibold text-xs block">Completed Today!</span>
                <span className="text-[10px] text-emerald-700">Streak updated in progress tracker</span>
              </div>
            ) : (
              <button
                onClick={() => navigate('/yoga')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Today’s Routine</span>
              </button>
            )}

            <button
              onClick={handleMarkComplete}
              disabled={planCompleted}
              className="py-2.5 px-4 rounded-xl border border-sage-300 text-sage-800 text-xs font-semibold hover:bg-sage-100 transition-colors disabled:opacity-40"
            >
              {planCompleted ? 'Marked Complete' : 'Quick Mark as Done'}
            </button>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="py-2 px-3 text-[11px] text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate with Gemini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Consistency Stats & Daily Wisdom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak & Consistency */}
        <div className="zen-glass p-6 rounded-3xl border border-sage-200/80 subtle-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">Weekly Consistency</h3>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{stats?.streak_days || 3} Day Streak</span>
            </div>
          </div>

          <WeeklyChart />

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-sage-100 text-center">
            <div className="p-2.5 rounded-xl bg-sage-50/70">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                Total Mindful Time
              </span>
              <span className="font-serif text-xl font-bold text-sage-900">
                {stats?.total_minutes || 45} mins
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-sage-50/70">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                Sessions Logged
              </span>
              <span className="font-serif text-xl font-bold text-sage-900">
                {stats?.total_sessions || 4}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Domains Launcher */}
        <div className="zen-glass p-6 rounded-3xl border border-sage-200/80 subtle-shadow space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900">Explore Sanctuary Zones</h3>
          
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/yoga"
              className="p-3.5 rounded-2xl bg-white/90 border border-sage-200/80 hover:bg-sage-50 hover:border-sage-300 transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-800 block">Yoga Library</span>
                <span className="text-[10px] text-stone-500">VOD & Live Flows</span>
              </div>
            </Link>

            <Link
              to="/meditation"
              className="p-3.5 rounded-2xl bg-white/90 border border-sage-200/80 hover:bg-sage-50 hover:border-sage-300 transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-800 block">Meditation</span>
                <span className="text-[10px] text-stone-500">Audio Guides</span>
              </div>
            </Link>

            <Link
              to="/sleep"
              className="p-3.5 rounded-2xl bg-white/90 border border-sage-200/80 hover:bg-sage-50 hover:border-sage-300 transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-800 block">Sleep Zone</span>
                <span className="text-[10px] text-stone-500">Bedtime Ambient</span>
              </div>
            </Link>

            <Link
              to="/face-yoga"
              className="p-3.5 rounded-2xl bg-white/90 border border-sage-200/80 hover:bg-sage-50 hover:border-sage-300 transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-800 block">Face Yoga</span>
                <span className="text-[10px] text-stone-500">TMJ & Glow</span>
              </div>
            </Link>
          </div>

          <Link
            to="/yoga/protocols"
            className="w-full py-2.5 px-3 rounded-xl bg-sage-100/70 hover:bg-sage-200/70 text-sage-800 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span>View Health Protocols (Back, Stress, Joint)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Daily Mindfulness Quote & Expert CTA */}
        <div className="zen-glass p-6 rounded-3xl border border-sage-200/80 subtle-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600 block">
              Daily Mindfulness Insight
            </span>
            <blockquote className="font-serif text-base italic text-stone-800 leading-relaxed">
              "{dashboardData?.daily_quote?.quote || 'The body benefits from movement, and the mind benefits from stillness.'}"
            </blockquote>
            <p className="text-xs text-stone-500 text-right">
              — {dashboardData?.daily_quote?.author || 'Sakyong Mipham'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-sage-700 to-sage-800 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sage-200">Personalized Guidance</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">1-on-1</span>
            </div>
            <h4 className="font-serif text-sm font-bold">Connect with a Yoga Therapist</h4>
            <p className="text-[11px] text-sage-100/90 leading-relaxed">
              Have unique joint concerns or want a customized breath schedule? Book with our accredited practitioners.
            </p>
            <Link
              to="/consult"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-sage-200 pt-1"
            >
              <span>Explore Expert Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Quick Practices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Recommended for Your Practice
            </h3>
            <p className="text-xs text-stone-500">Curated restorative modules for anytime relief</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData?.quick_recommendations?.map((rec) => (
            <WellnessCard
              key={rec.id}
              title={rec.title}
              category={rec.category}
              duration={rec.duration_minutes}
              tag={rec.tag}
              route={rec.route}
              actionText="Start Practice"
            />
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
