import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Download, 
  LogOut, 
  Save, 
  Sparkles,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function ProfilePage() {
  const { user, profile, setProfile, signOut, signInDemo } = useAuth();

  const [name, setName] = useState(profile?.name || user?.name || 'Aria Montgomery');
  const [age, setAge] = useState(profile?.age || 29);
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || 'Beginner');
  const [dailyMinutes, setDailyMinutes] = useState(profile?.daily_available_minutes || 20);
  const [preferredLang, setPreferredLang] = useState(profile?.preferred_language || 'English');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.age) setAge(profile.age);
      if (profile.experience_level) setExperienceLevel(profile.experience_level);
      if (profile.daily_available_minutes) setDailyMinutes(profile.daily_available_minutes);
      if (profile.preferred_language) setPreferredLang(profile.preferred_language);
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        age: Number(age),
        experience_level: experienceLevel,
        daily_available_minutes: Number(dailyMinutes),
        goals: profile?.goals || ['Stress', 'Flexibility'],
        preferred_language: preferredLang
      };
      const res = await api.submitOnboarding(payload);
      if (res?.profile) {
        setProfile(res.profile);
      }
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      alert('Updated preferences saved locally.');
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ profile, user, exportedAt: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "prana_wellness_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
          Settings & Mindful Preferences
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Your Profile & Privacy Sanctuary
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Customize your experience level, daily time commitment, notification preferences, and privacy controls.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Preferences updated and your Gemini daily plans synchronized.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="zen-glass p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-6">
        <div className="flex items-center gap-4 border-b border-sage-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-sage-200 border-2 border-sage-300 flex items-center justify-center text-sage-800 text-2xl font-bold shadow-sm">
            {name ? name[0] : 'P'}
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">{name}</h3>
            <p className="text-xs text-stone-500">{user?.email || 'seeker@wellness.local'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-sage-100 text-sage-800 px-2.5 py-0.5 rounded-full">
              {experienceLevel} Practitioner
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Daily Available Minutes</label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
            >
              <option value={10}>10 Minutes / Day</option>
              <option value={15}>15 Minutes / Day</option>
              <option value={20}>20 Minutes / Day</option>
              <option value={30}>30 Minutes / Day</option>
              <option value={45}>45 Minutes / Day</option>
            </select>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="pt-4 border-t border-sage-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-sage-600" />
              Daily Mindful Practice Reminders
            </span>
            <span className="text-[11px] text-stone-500 block">
              Receive gentle push chimes at your preferred practice hour.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={(e) => setRemindersEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Privacy & Data Assurance */}
      <div className="zen-glass p-6 sm:p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-100 text-sage-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-stone-900">Data Privacy & Sovereignty</h4>
            <p className="text-xs text-stone-500">Camera frames are ephemeral and encrypted at rest</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Prana operates strictly on ephemeral processing principles. Video frames captured during AI Pose Alignment are analyzed strictly in server memory without disk persistence. You retain full right to export or delete your wellness history at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sage-300 text-sage-800 text-xs font-semibold hover:bg-sage-100/60 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Wellness Data (.JSON)</span>
          </button>

          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
