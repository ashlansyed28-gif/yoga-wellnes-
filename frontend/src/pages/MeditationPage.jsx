import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Headphones,
  Compass,
  Filter
} from 'lucide-react';
import { soundscapes } from '../lib/audioSynth';
import { api } from '../lib/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const MEDITATIONS = [
  {
    id: 'med-1',
    title: '2-Minute Somatic Stress Reset',
    category: '2 min',
    duration: 2,
    tag: 'Quick Pause',
    guide: 'Julian Vance',
    description: 'An instantaneous neurological pause to unclench the jaw, soften the shoulders, and drop out of anxiety loops.',
    soundType: 'ocean'
  },
  {
    id: 'med-2',
    title: '5-Minute Morning Loving Kindness (Metta)',
    category: '5 min',
    duration: 5,
    tag: 'Compassion',
    guide: 'Dr. Ananya Sharma',
    description: 'Cultivate peaceful warmth directed towards yourself, loved ones, and all sentient life to start the day grounded.',
    soundType: 'singing_bowl'
  },
  {
    id: 'med-3',
    title: '10-Minute Vipassana Breath & Thought Witnessing',
    category: '10 min',
    duration: 10,
    tag: 'Mindfulness',
    guide: 'Julian Vance',
    description: 'Notice thoughts arising and passing like clouds in the vast open sky without judgment or identification.',
    soundType: 'forest'
  },
  {
    id: 'med-4',
    title: '15-Minute Deep Rest Yoga Nidra',
    category: 'Sleep',
    duration: 15,
    tag: 'Deep Recovery',
    guide: 'Mei-Ling Chen',
    description: 'Conscious relaxation between wakefulness and sleep. Equivalent to 2 hours of restorative rest.',
    soundType: 'rain'
  },
  {
    id: 'med-5',
    title: '8-Minute Focus & Single-Pointed Attention',
    category: 'Focus',
    duration: 8,
    tag: 'Cognitive Reset',
    guide: 'Aarav Patel',
    description: 'Anchoring attention firmly on the subtle sensation of air touching the upper lip, heightening cognitive clarity.',
    soundType: 'forest'
  },
  {
    id: 'med-6',
    title: '12-Minute Full Sensory Body Scan',
    category: 'Body Scan',
    duration: 12,
    tag: 'Somatic Awareness',
    guide: 'Dr. Ananya Sharma',
    description: 'Progressively moving warm, non-judgmental awareness through each anatomical section to release chronic armoring.',
    soundType: 'ocean'
  }
];

const CATEGORIES = ['All', '2 min', '5 min', '10 min', 'Sleep', 'Focus', 'Body Scan'];

export default function MeditationPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeMed, setActiveMed] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completed, setCompleted] = useState(false);

  const filtered = selectedCat === 'All'
    ? MEDITATIONS
    : MEDITATIONS.filter((m) => m.category === selectedCat);

  const startMeditation = (med) => {
    setActiveMed(med);
    setSecondsLeft(med.duration * 60);
    setIsPlaying(true);
    setCompleted(false);

    // Play initial Tibetan singing bowl chime
    soundscapes.playSingingBowl(216);

    // Turn on accompanying ambient sound
    if (med.soundType === 'rain') soundscapes.playRain();
    else if (med.soundType === 'ocean') soundscapes.playOcean();
    else if (med.soundType === 'forest') soundscapes.playForest();
  };

  const togglePlay = () => {
    if (isPlaying) {
      soundscapes.stop();
      setIsPlaying(false);
    } else {
      if (activeMed) {
        if (activeMed.soundType === 'rain') soundscapes.playRain();
        else if (activeMed.soundType === 'ocean') soundscapes.playOcean();
        else if (activeMed.soundType === 'forest') soundscapes.playForest();
      }
      setIsPlaying(true);
    }
  };

  const stopMeditation = () => {
    soundscapes.stop();
    setActiveMed(null);
    setIsPlaying(false);
  };

  // Timer tick
  useEffect(() => {
    let timer = null;
    if (isPlaying && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setCompleted(true);
            soundscapes.stop();
            soundscapes.playSingingBowl(240);
            if (activeMed) {
              api.completeSession('Meditation', activeMed.duration).catch(() => {});
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsLeft, activeMed]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
            Mindfulness & Stillness Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Meditation & Somatic Stillness
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Choose from 2-minute emergency resets to deep 15-minute Yoga Nidra practices accompanied by organic soundscapes.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-stone-400 mr-1 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCat === cat
                ? 'bg-sage-700 text-white shadow-sm'
                : 'bg-white/80 border border-sage-200 text-stone-700 hover:bg-sage-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Meditation Player Banner */}
      {activeMed && (
        <div className="p-6 md:p-8 rounded-3xl zen-glass border-2 border-sage-400 subtle-shadow animate-fade-in flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sage-700 bg-sage-100 px-3 py-1 rounded-full">
              Meditation in Session • Ambient {activeMed.soundType} Soundscape
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              {activeMed.title}
            </h3>
            <p className="text-xs text-stone-600 max-w-md">
              {activeMed.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="font-serif text-5xl font-bold text-sage-900 tracking-tight">
              {formatTime(secondsLeft)}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => {
                  soundscapes.playSingingBowl(216);
                }}
                title="Ring Singing Bowl Chime"
                className="p-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={stopMeditation}
                className="px-4 py-2.5 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium"
              >
                Close
              </button>
            </div>

            {completed && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                Session completed & recorded in your tracker
              </span>
            )}
          </div>
        </div>
      )}

      {/* Meditation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow hover:subtle-glow flex flex-col justify-between transition-all duration-300 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sage-100 text-sage-800">
                  {item.tag}
                </span>
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-sage-600" />
                  <span>{item.duration} mins</span>
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-sage-800 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-sage-100">
                <span>Guided by <strong>{item.guide}</strong></span>
                <span className="capitalize">🎵 {item.soundType}</span>
              </div>
            </div>

            <div className="pt-5">
              <button
                onClick={() => startMeditation(item)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Begin Meditation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
