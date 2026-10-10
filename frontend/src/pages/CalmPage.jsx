import React, { useState } from 'react';
import { 
  Wind, 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  Bell, 
  Eye, 
  Volume2, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import BreathingVisualizer from '../components/BreathingVisualizer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const LIVE_SESSIONS = [
  {
    id: 'live-1',
    title: 'Midday Reset & Vagal Nerve Activation',
    guide: 'Julian Vance, MBSR Instructor',
    time: '12:30 PM EST',
    duration: '20 mins',
    attendees: 142,
    isLiveNow: true,
    tag: 'Live Now'
  },
  {
    id: 'live-2',
    title: 'Twilight Sound Bath & Tibetan Bowls',
    guide: 'Dr. Ananya Sharma',
    time: '06:00 PM EST',
    duration: '30 mins',
    attendees: 289,
    isLiveNow: false,
    tag: 'Upcoming'
  },
  {
    id: 'live-3',
    title: 'Nighttime Somatic Body Scan for Insomnia',
    guide: 'Mei-Ling Chen',
    time: '09:30 PM EST',
    duration: '25 mins',
    attendees: 310,
    isLiveNow: false,
    tag: 'Upcoming'
  }
];

export default function CalmPage() {
  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing', 'grounding', 'live'
  const [reminders, setReminders] = useState({});

  const toggleReminder = (id) => {
    setReminders((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide">
          <Wind className="w-3.5 h-3.5" />
          <span>Emergency Calm & Nervous System Reset</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Find Your Center Right Now
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          If you are experiencing elevated anxiety, heart pounding, or overwhelm, drop your gaze, release your jaw, and let this guided rhythm support your nervous system.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'breathing'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white border border-sage-200 text-stone-700 hover:bg-sage-50'
            }`}
          >
            Paced Breathing Visualizer
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'grounding'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white border border-sage-200 text-stone-700 hover:bg-sage-50'
            }`}
          >
            5-4-3-2-1 Sensory Grounding
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'live'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white border border-sage-200 text-stone-700 hover:bg-sage-50'
            }`}
          >
            Live Guided Circles
          </button>
        </div>
      </div>

      {/* Tab 1: Paced Breathing Visualizer */}
      {activeTab === 'breathing' && (
        <div className="animate-fade-in space-y-6">
          <BreathingVisualizer defaultMode="relax478" targetCycles={4} />
        </div>
      )}

      {/* Tab 2: 5-4-3-2-1 Sensory Grounding */}
      {activeTab === 'grounding' && (
        <div className="zen-glass p-8 rounded-3xl border border-sage-200 subtle-shadow max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              5-4-3-2-1 Somatic Grounding Technique
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Engage your sensory cortices to anchor yourself back into the safe reality of the physical room.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-800">
            <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-base">
                5
              </span>
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Notice 5 things you can SEE</strong>
                <span className="text-stone-600 text-xs">Look around you: a pattern on the wall, the grain of wood, light passing through a window, your hands.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-base">
                4
              </span>
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Feel 4 things you can TOUCH</strong>
                <span className="text-stone-600 text-xs">The texture of your clothing, the soles of your feet on the floor, the cool temperature of a desk, your hair.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-base">
                3
              </span>
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Identify 3 things you can HEAR</strong>
                <span className="text-stone-600 text-xs">A clock ticking, distant traffic, the rustle of leaves, or the soft sound of your own quiet breath.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-base">
                2
              </span>
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Detect 2 things you can SMELL</strong>
                <span className="text-stone-600 text-xs">Fresh air, tea, incense, or simply the scent of your skin.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-base">
                1
              </span>
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Acknowledge 1 thing you can TASTE</strong>
                <span className="text-stone-600 text-xs">A sip of water or the residual sweetness of your breath. Whisper: "I am safe in this present moment."</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Guided Sessions */}
      {activeTab === 'live' && (
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Real-Time Guided Mindfulness Circles
            </h3>
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Broadcast Schedule
            </span>
          </div>

          <div className="space-y-3">
            {LIVE_SESSIONS.map((session) => {
              const isReminded = reminders[session.id];
              return (
                <div
                  key={session.id}
                  className="p-6 rounded-3xl zen-glass border border-sage-200/80 subtle-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {session.isLiveNow ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500 text-white animate-pulse">
                          Live Now
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sage-200 text-sage-800">
                          {session.tag}
                        </span>
                      )}
                      <span className="text-xs text-stone-500 font-medium">
                        {session.time} • {session.duration}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {session.title}
                    </h4>

                    <p className="text-xs text-stone-600">
                      Guided by <strong>{session.guide}</strong> • {session.attendees} practitioners in circle
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.isLiveNow ? (
                      <button
                        onClick={() => alert(`Entering live room for "${session.title}". Breathing together with ${session.attendees} practitioners.`)}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                      >
                        Join Live Circle
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleReminder(session.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          isReminded
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-sage-200 text-stone-700 hover:bg-sage-50'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isReminded ? 'Reminder Set' : 'Set Reminder'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
