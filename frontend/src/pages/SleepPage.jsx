import React, { useState } from 'react';
import { 
  Moon, 
  CloudRain, 
  Waves, 
  Trees, 
  Bell, 
  VolumeX, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { soundscapes } from '../lib/audioSynth';
import { api } from '../lib/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const BEDTIME_FLOWS = [
  {
    id: 'slp-1',
    title: 'Legs-Up-The-Wall (Viparita Karani) Release',
    duration: 10,
    tag: 'Parasympathetic Surrender',
    description: 'Elevating the legs reverses venous pooling, downshifts heart rate, and signals your body that it is safe to sleep.'
  },
  {
    id: 'slp-2',
    title: 'Reclined Supported Butterfly with Slow Exhales',
    duration: 12,
    tag: 'Pelvic Decompression',
    description: 'Placing pillows under knees while exhaling for 6 seconds releases abdominal tension and eases restlessness.'
  },
  {
    id: 'slp-3',
    title: '4-7-8 Somatic Bedtime Breath Protocol',
    duration: 8,
    tag: 'Natural Tranquilizer',
    description: 'Four cycles of the Dr. Weil 4-7-8 breathing sequence to silence racing thoughts and settle sympathetic spikes.'
  }
];

export default function SleepPage() {
  const [activeSound, setActiveSound] = useState(null);
  const [completedRoutine, setCompletedRoutine] = useState(null);

  const toggleSoundscape = (type) => {
    if (activeSound === type) {
      soundscapes.stop();
      setActiveSound(null);
    } else {
      if (type === 'rain') soundscapes.playRain();
      if (type === 'ocean') soundscapes.playOcean();
      if (type === 'forest') soundscapes.playForest();
      setActiveSound(type);
    }
  };

  const handleStartBedtimeRoutine = (item) => {
    soundscapes.playSingingBowl(216);
    api.completeSession('Sleep', item.duration).catch(() => {});
    setCompletedRoutine(item.id);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-semibold mb-2">
          <Moon className="w-3.5 h-3.5" />
          <span>Restorative Bedtime Zone</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Sleep & Nighttime Restoration
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Prepare your autonomic nervous system for deep, unfragmented REM and slow-wave sleep through soothing ambient frequencies and gentle somatic releases.
        </p>
      </div>

      {/* Ambient Soundscapes Console */}
      <div className="zen-glass p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Continuous Ambient Soundscapes
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              High-fidelity audio synthesized directly in your browser. Leave running as you fall asleep.
            </p>
          </div>

          {activeSound && (
            <button
              onClick={() => {
                soundscapes.stop();
                setActiveSound(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <VolumeX className="w-4 h-4" />
              <span>Silence Soundscape</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => toggleSoundscape('rain')}
            className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
              activeSound === 'rain'
                ? 'bg-sage-700 text-white border-sage-700 shadow-md scale-102'
                : 'bg-white/80 border-sage-200 text-stone-800 hover:bg-sage-50'
            }`}
          >
            <CloudRain className="w-8 h-8" />
            <div>
              <span className="font-serif text-base font-bold block">Gentle Night Rain</span>
              <span className="text-[11px] opacity-80">Pink noise spectrum masking external disturbance</span>
            </div>
          </button>

          <button
            onClick={() => toggleSoundscape('ocean')}
            className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
              activeSound === 'ocean'
                ? 'bg-sage-700 text-white border-sage-700 shadow-md scale-102'
                : 'bg-white/80 border-sage-200 text-stone-800 hover:bg-sage-50'
            }`}
          >
            <Waves className="w-8 h-8" />
            <div>
              <span className="font-serif text-base font-bold block">Rolling Ocean Tides</span>
              <span className="text-[11px] opacity-80">Rhythmic ~6.5 second waves syncing with deep breath</span>
            </div>
          </button>

          <button
            onClick={() => toggleSoundscape('forest')}
            className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
              activeSound === 'forest'
                ? 'bg-sage-700 text-white border-sage-700 shadow-md scale-102'
                : 'bg-white/80 border-sage-200 text-stone-800 hover:bg-sage-50'
            }`}
          >
            <Trees className="w-8 h-8" />
            <div>
              <span className="font-serif text-base font-bold block">Whispering Forest Breeze</span>
              <span className="text-[11px] opacity-80">Soft organic rustle releasing cognitive fixation</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bedtime Routines */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-stone-900">
          Bedside Somatic Routines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BEDTIME_FLOWS.map((item) => {
            const isDone = completedRoutine === item.id;
            return (
              <div
                key={item.id}
                className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow hover:subtle-glow flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900">
                      {item.tag}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sage-600" />
                      {item.duration} mins
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5">
                  <button
                    onClick={() => handleStartBedtimeRoutine(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sage-700 hover:bg-sage-800 text-white active:scale-95'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed & Logged</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Begin Routine</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
