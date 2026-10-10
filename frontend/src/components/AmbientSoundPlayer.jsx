import React, { useState } from 'react';
import { CloudRain, Waves, Trees, Bell, VolumeX, Sparkles } from 'lucide-react';
import { soundscapes } from '../lib/audioSynth';

export default function AmbientSoundPlayer({ className = '' }) {
  const [activeSound, setActiveSound] = useState(null);

  const toggleSound = (soundType) => {
    if (activeSound === soundType) {
      soundscapes.stop();
      setActiveSound(null);
    } else {
      if (soundType === 'rain') soundscapes.playRain();
      if (soundType === 'ocean') soundscapes.playOcean();
      if (soundType === 'forest') soundscapes.playForest();
      setActiveSound(soundType);
    }
  };

  const ringBowl = () => {
    soundscapes.playSingingBowl(216);
  };

  return (
    <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 border border-sage-200/90 shadow-sm backdrop-blur-md ${className}`}>
      <span className="text-[11px] font-semibold text-sage-800 uppercase tracking-wider pl-2 pr-1 hidden sm:inline-flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-sage-600" />
        Soundscape
      </span>

      <button
        onClick={() => toggleSound('rain')}
        title="Rain Ambience"
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
          activeSound === 'rain'
            ? 'bg-sage-600 text-white font-medium shadow-sm'
            : 'text-stone-600 hover:bg-sage-100/70'
        }`}
      >
        <CloudRain className="w-4 h-4" />
        <span className="hidden md:inline">Rain</span>
      </button>

      <button
        onClick={() => toggleSound('ocean')}
        title="Ocean Waves Ambience"
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
          activeSound === 'ocean'
            ? 'bg-sage-600 text-white font-medium shadow-sm'
            : 'text-stone-600 hover:bg-sage-100/70'
        }`}
      >
        <Waves className="w-4 h-4" />
        <span className="hidden md:inline">Ocean</span>
      </button>

      <button
        onClick={() => toggleSound('forest')}
        title="Forest Wind Ambience"
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
          activeSound === 'forest'
            ? 'bg-sage-600 text-white font-medium shadow-sm'
            : 'text-stone-600 hover:bg-sage-100/70'
        }`}
      >
        <Trees className="w-4 h-4" />
        <span className="hidden md:inline">Forest</span>
      </button>

      <div className="h-4 w-[1px] bg-sage-200 mx-0.5" />

      <button
        onClick={ringBowl}
        title="Ring Tibetan Singing Bowl Chime"
        className="p-2 rounded-xl text-xs text-amber-800 hover:bg-amber-100/80 transition-all flex items-center gap-1.5"
      >
        <Bell className="w-4 h-4 text-amber-600" />
        <span className="hidden lg:inline text-[11px] font-medium">Chime</span>
      </button>

      {activeSound && (
        <button
          onClick={() => {
            soundscapes.stop();
            setActiveSound(null);
          }}
          title="Stop Ambient Sound"
          className="p-2 rounded-xl text-xs text-rose-700 hover:bg-rose-100 transition-all"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
