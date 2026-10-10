import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, Check, Heart, Clock, Compass } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const GOAL_OPTIONS = [
  { id: 'Stress', label: 'Stress & Anxiety Relief', icon: '🌿' },
  { id: 'Flexibility', label: 'Flexibility & Joint Mobility', icon: '🤸' },
  { id: 'Sleep', label: 'Deep Rest & Sleep Recovery', icon: '🌙' },
  { id: 'Focus', label: 'Mental Clarity & Mindful Focus', icon: '🎯' },
  { id: 'Posture', label: 'Spine Health & Desk Posture', icon: '🧘' },
  { id: 'Face Yoga', label: 'Facial Toning & TMJ Release', icon: '✨' },
  { id: 'Weight-management', label: 'Gentle Energy & Metabolism', icon: '⚡' },
  { id: 'Specific Health Conditions', label: 'Restorative Gentle Protocols', icon: '🌸' }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || 'Aria Montgomery',
    age: 28,
    gender: 'Female',
    preferred_language: 'English',
    experience_level: 'Beginner',
    daily_available_minutes: 20,
    goals: ['Stress', 'Flexibility']
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleGoal = (goalId) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalId);
      const updated = exists ? prev.goals.filter((g) => g !== goalId) : [...prev.goals, goalId];
      return { ...prev, goals: updated.length ? updated : [goalId] };
    });
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.submitOnboarding(formData);
      if (res?.profile) {
        setProfile(res.profile);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed:', err);
      setErrorMsg(err.message || 'Intake failed. Entering sanctuary with sample plan.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold mb-2">
            <span>Intake Step {step} of 3</span>
          </div>
          <div className="w-full bg-sage-200 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-sage-700 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="zen-glass p-8 sm:p-10 rounded-3xl border border-sage-200 subtle-shadow space-y-6">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Welcome to Your Sanctuary
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Let’s begin by learning a little about your personal foundation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Age</label>
                    <input
                      type="number"
                      min={13}
                      max={110}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Gender (Optional)</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Preferred Language</label>
                  <select
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Mandarin">中文 (Mandarin)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Experience & Time Availability */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Your Rhythm & Experience
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  How much time can you carve out for your peace of mind each day?
                </p>
              </div>

              {/* Experience Level Selector */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-2">Yoga Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, experience_level: lvl })}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        formData.experience_level === lvl
                          ? 'bg-sage-700 text-white border-sage-700 shadow-md'
                          : 'bg-white/80 border-sage-200 text-stone-700 hover:bg-sage-50'
                      }`}
                    >
                      <span className="block font-semibold text-sm">{lvl}</span>
                      <span className="text-[10px] opacity-80 block mt-1">
                        {lvl === 'Beginner' ? 'Gentle fundamentals' : lvl === 'Intermediate' ? 'Steady flow' : 'Challenging asanas'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Availability */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700">Daily Available Time</label>
                  <span className="text-sm font-bold text-sage-800">
                    {formData.daily_available_minutes} Minutes / Day
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormData({ ...formData, daily_available_minutes: mins })}
                      className={`py-3 rounded-xl border text-xs font-semibold transition-all ${
                        formData.daily_available_minutes === mins
                          ? 'bg-sage-700 text-white border-sage-700 shadow-sm'
                          : 'bg-white border-sage-200 text-stone-700 hover:bg-sage-50'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Select Wellness Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Your Intentions & Wellness Goals
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Choose the areas you'd like your Gemini AI routine to emphasize.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = formData.goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-sage-100/90 border-sage-400 text-sage-950 font-semibold shadow-sm'
                          : 'bg-white/80 border-sage-200 text-stone-700 hover:bg-sage-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{g.icon}</span>
                        <span className="text-xs">{g.label}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-sage-700 border-sage-700 text-white' : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-amber-100 text-amber-900 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <MedicalDisclaimer compact={true} />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-sage-200" />
                  <span>{submitting ? 'Synthesizing AI Plan...' : 'Generate My Daily Plan'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
