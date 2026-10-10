import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Wind, Camera, HeartHandshake, ShieldCheck, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInDemo } = useAuth();
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleDemoStart = () => {
    signInDemo();
    navigate('/dashboard');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    signInDemo(); // Seamless exploration
    if (authMode === 'signup') {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 selection:bg-sage-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Blur circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-sand-200/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-sage-800 text-xs font-semibold tracking-wide shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Harmonizing Ancient Vedic Wisdom & Multimodal AI</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-stone-900 font-bold tracking-tight leading-tight">
            Restore Equilibrium to Your <span className="text-sage-700 italic">Body & Mind</span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A sanctuary for personalized yoga routines, paced breathwork, AI camera alignment guidance, and expert consultation—engineered to gently calm the nervous system.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                signInDemo();
                navigate('/onboarding');
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>Begin Personalized Intake</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDemoStart}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-sage-50 text-stone-800 font-semibold text-sm border border-sage-200 shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-sage-600" />
              <span>Explore Instant Demo</span>
            </button>

            <button
              onClick={() => navigate('/calm')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-600 hover:brightness-105 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <Wind className="w-4 h-4" />
              <span>Emergency Calm Mode</span>
            </button>
          </div>
        </div>

        {/* Auth / Login Card */}
        <div className="mt-16 max-w-md mx-auto zen-glass p-8 rounded-3xl border border-sage-200 subtle-shadow">
          <div className="flex border-b border-sage-100 pb-4 mb-6">
            <button
              onClick={() => setAuthMode('signin')}
              className={`flex-1 text-center pb-2 text-sm font-semibold border-b-2 transition-colors ${
                authMode === 'signin'
                  ? 'border-sage-700 text-sage-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 text-center pb-2 text-sm font-semibold border-b-2 transition-colors ${
                authMode === 'signup'
                  ? 'border-sage-700 text-sage-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seeker@mindful.org"
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm transition-all shadow-sm active:scale-98"
            >
              {authMode === 'signin' ? 'Sign In to Sanctuary' : 'Complete Registration'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-2 text-stone-500">or explore freely</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoStart}
            className="w-full py-2.5 rounded-xl border border-sage-300 text-sage-800 text-xs font-semibold hover:bg-sage-100/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Continue as Guest Seeker (Instant Access)</span>
          </button>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 bg-white/70 border-y border-sage-100 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Integrated Pillars of Mind-Body Restoration
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            A cohesive journey from daily self-practice to clinical-grade human guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl zen-glass border border-sage-200 subtle-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Gemini Daily Plan</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dynamically synthesized routines factoring your exact daily available minutes, experience tier, and target wellness goals.
            </p>
          </div>

          <div className="p-6 rounded-3xl zen-glass border border-sage-200 subtle-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">AI Pose Correction</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Camera-assisted multimodal alignment cues with privacy-first ephemeral frame analysis and safe joint protection.
            </p>
          </div>

          <div className="p-6 rounded-3xl zen-glass border border-sage-200 subtle-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Emergency Calm Mode</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              1-click rapid nervous system reset featuring paced 4-7-8, Box Breathing, and grounding sensory prompts.
            </p>
          </div>

          <div className="p-6 rounded-3xl zen-glass border border-sage-200 subtle-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Certified Specialists</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Seamless booking directory with verified yoga therapists, MBSR mindfulness guides, and facial neuromuscle coaches.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Medical Advisory Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <MedicalDisclaimer />
        <div className="text-center text-xs text-stone-500 mt-8">
          © {new Date().getFullYear()} Prana Yoga & Mind Wellness. Dedicated to peace, breath, and sustainable vitality.
        </div>
      </footer>
    </div>
  );
}
