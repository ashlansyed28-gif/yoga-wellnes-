import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { soundscapes } from '../lib/audioSynth';
import { api } from '../lib/api';

const BREATH_MODES = {
  box: {
    name: 'Box Breathing (Sama Vritti)',
    description: 'Equal ratio breath for nervous system stabilization and intense focus.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
      { name: 'Hold', duration: 4, instruction: 'Hold breath with ease and relaxation' },
      { name: 'Exhale', duration: 4, instruction: 'Release breath smoothly out your mouth' },
      { name: 'Hold', duration: 4, instruction: 'Rest in quiet stillness' }
    ]
  },
  relax478: {
    name: '4-7-8 Relaxing Breath',
    description: 'Natural tranquilizer for the nervous system; ideal for anxiety and sleep.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Quietly inhale through your nose' },
      { name: 'Hold', duration: 7, instruction: 'Suspend the breath gently' },
      { name: 'Exhale', duration: 8, instruction: 'Make an unhurried whoosh sound through parted lips' }
    ]
  },
  gentle46: {
    name: '4-6 Vagal Grounding',
    description: 'Extended exhalation to stimulate parasympathetic vagus nerve tone.',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Gentle smooth inhale filling the lower belly' },
      { name: 'Exhale', duration: 6, instruction: 'Long, soft exhale releasing all tension' }
    ]
  }
};

export default function BreathingVisualizer({ defaultMode = 'box', onComplete = null, targetCycles = 4 }) {
  const [selectedModeKey, setSelectedModeKey] = useState(defaultMode);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(BREATH_MODES[defaultMode].phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const mode = BREATH_MODES[selectedModeKey];
  const currentPhase = mode.phases[currentPhaseIndex];

  // Sound chime on phase change
  const triggerChime = () => {
    if (chimeEnabled) {
      soundscapes.playSingingBowl(240);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIndex = (currentPhaseIndex + 1) % mode.phases.length;
            if (nextIndex === 0) {
              const newCycleCount = completedCycles + 1;
              setCompletedCycles(newCycleCount);
              if (newCycleCount >= targetCycles) {
                setIsFinished(true);
                setIsActive(false);
                // Log session in backend
                const durationMinutes = Math.max(1, Math.round((targetCycles * mode.phases.reduce((a, b) => a + b.duration, 0)) / 60));
                api.completeSession('Breathing', durationMinutes).catch(() => {});
                if (onComplete) onComplete();
              }
            }
            setCurrentPhaseIndex(nextIndex);
            triggerChime();
            return mode.phases[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, mode, completedCycles, targetCycles, chimeEnabled, isFinished]);

  const handleStartStop = () => {
    if (isFinished) {
      resetSession();
      setIsActive(true);
      triggerChime();
      return;
    }
    if (!isActive) {
      triggerChime();
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(mode.phases[0].duration);
    setCompletedCycles(0);
  };

  const changeMode = (key) => {
    setSelectedModeKey(key);
    setIsActive(false);
    setIsFinished(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(BREATH_MODES[key].phases[0].duration);
    setCompletedCycles(0);
  };

  // Determine scale for animation based on phase
  const isExpanding = currentPhase.name === 'Inhale';
  const isHolding = currentPhase.name === 'Hold';
  const isContracting = currentPhase.name === 'Exhale';

  let circleScale = 'scale-100';
  if (isActive) {
    if (isExpanding) circleScale = 'scale-125 md:scale-135';
    else if (isHolding) circleScale = currentPhaseIndex === 1 ? 'scale-125 md:scale-135' : 'scale-90';
    else if (isContracting) circleScale = 'scale-90';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 zen-glass rounded-3xl subtle-shadow border border-sage-200/80 max-w-2xl mx-auto w-full">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
        {Object.entries(BREATH_MODES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => changeMode(key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
              selectedModeKey === key
                ? 'bg-sage-700 text-white shadow-sm'
                : 'bg-sage-100/70 text-sage-800 hover:bg-sage-200'
            }`}
          >
            {item.name.split(' (')[0]}
          </button>
        ))}
      </div>

      <div className="text-center mb-6 max-w-md">
        <h3 className="text-xl md:text-2xl font-serif font-medium text-stone-800 tracking-tight">
          {mode.name}
        </h3>
        <p className="text-xs md:text-sm text-stone-600 mt-1 leading-relaxed">
          {mode.description}
        </p>
      </div>

      {/* Main Breathing Visualizer Circle */}
      <div className="relative flex items-center justify-center w-64 h-64 md:w-76 md:h-76 my-6">
        {/* Ambient Outer Halo */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sage-200 via-sage-300 to-sand-200 opacity-40 blur-2xl transition-all duration-1000 ${
            isActive ? (isExpanding ? 'scale-150 opacity-70' : 'scale-95 opacity-30') : 'scale-100 opacity-25'
          }`}
        />

        {/* Outer Ring */}
        <div
          className={`absolute inset-4 rounded-full border-2 border-sage-300/60 transition-transform duration-[${currentPhase.duration}000ms] ease-in-out ${circleScale}`}
        />

        {/* Pulsing Core Circle */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-sage-500 via-sage-600 to-sage-700 text-white shadow-2xl transition-all duration-1000 ease-in-out ${
            isActive ? circleScale : 'scale-100'
          }`}
          style={{
            boxShadow: isActive
              ? '0 0 45px rgba(94, 134, 99, 0.45)'
              : '0 10px 25px rgba(94, 134, 99, 0.2)'
          }}
        >
          {isFinished ? (
            <div className="flex flex-col items-center text-center p-4">
              <CheckCircle2 className="w-12 h-12 text-sage-200 mb-2 animate-bounce" />
              <span className="font-serif text-lg font-medium text-white">Mind Centered</span>
              <span className="text-xs text-sage-200 mt-1">Practice Recorded</span>
            </div>
          ) : (
            <div className="text-center px-4">
              <span className="text-xs uppercase tracking-widest text-sage-200 font-semibold block mb-1">
                {isActive ? currentPhase.name : 'Ready'}
              </span>
              <span className="text-5xl md:text-6xl font-serif font-bold tracking-tight block">
                {isActive ? phaseSecondsLeft : mode.phases[0].duration}
              </span>
              <span className="text-[11px] text-sage-100 mt-1 block font-medium opacity-90 max-w-[130px] mx-auto truncate">
                {isActive ? currentPhase.instruction : 'Press Begin'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Cycles Indicator */}
      <div className="flex items-center justify-between w-full max-w-xs mt-4 px-2 text-xs text-stone-600 font-medium">
        <span>Cycle: <strong className="text-sage-800">{completedCycles} / {targetCycles}</strong></span>
        <span>Phase: <strong className="text-sage-800">{currentPhase.name}</strong></span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handleStartStop}
          className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-sage-700 hover:bg-sage-800 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : isFinished ? (
            <>
              <RotateCcw className="w-4 h-4" /> Practice Again
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Begin Breathing
            </>
          )}
        </button>

        <button
          onClick={resetSession}
          title="Reset"
          className="p-3.5 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setChimeEnabled(!chimeEnabled)}
          title={chimeEnabled ? 'Tibetan Chime On' : 'Tibetan Chime Muted'}
          className={`p-3.5 rounded-full transition-colors ${
            chimeEnabled ? 'bg-sage-200 text-sage-900' : 'bg-stone-200 text-stone-500'
          }`}
        >
          {chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
