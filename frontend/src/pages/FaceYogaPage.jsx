import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Camera, 
  CameraOff, 
  Clock, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  RotateCcw,
  Shield
} from 'lucide-react';
import { api } from '../lib/api';
import { soundscapes } from '../lib/audioSynth';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const FACE_EXERCISES = [
  {
    id: 'fy-1',
    title: 'Jaw Clenching & TMJ Decompression',
    target: 'Masseter & Temporalis Muscles',
    duration: 5,
    tag: 'Tension Relief',
    description: 'Release chronic jaw clenching and nighttime teeth grinding through gentle acupressure and gentle mouth releases.',
    steps: [
      'Place index and middle finger knuckles into the soft hollow under your cheekbone.',
      'Drop your lower jaw open softly and breathe out a quiet "ahhh".',
      'Make gentle downward circular circles for 60 seconds along the masseter muscle.',
      'Swallow gently and rest with teeth slightly parted and tongue on the roof of the mouth.'
    ]
  },
  {
    id: 'fy-2',
    title: 'Digital Eye Strain & Brow Smoother',
    target: 'Orbicularis Oculi & Corrugator Supercilii',
    duration: 4,
    tag: 'Screen Fatigue',
    description: 'Counteracts screen glare squinting and softens deep vertical "11" lines between the eyebrows.',
    steps: [
      'Rub your palms together briskly until warm, then cup them softly over closed eyes without pressing.',
      'Hold the warmth for 5 deep breaths, letting eye sockets relax.',
      'Take your thumbs to the inner corners of the eyebrow bone and gently slide outward toward the temples.',
      'Flutter your eyelids rapidly for 15 seconds to stimulate fresh tear film hydration.'
    ]
  },
  {
    id: 'fy-3',
    title: 'Forehead Tension Melting & Horizontal Line Softener',
    target: 'Frontalis Muscle',
    duration: 5,
    tag: 'Smooth Brow',
    description: 'Dissolves stress headaches and forehead furrowing through gentle zigzag myofascial glide.',
    steps: [
      'Place both flat hands across your forehead with fingertips meeting in the center.',
      'Apply light pressure and smooth outward toward your hairline while opening your eyes wide without wrinkling the brow.',
      'Repeat 8 slow times, synchronizing with long smooth exhalations.'
    ]
  },
  {
    id: 'fy-4',
    title: 'Cheek Sculpt & Lymphatic Drainage',
    target: 'Zygomaticus Major & Lymph Nodes',
    duration: 6,
    tag: 'Radiant Glow',
    description: 'Stimulates microcirculation, boosts collagen oxygenation, and encourages lymphatic drainage along the jawline.',
    steps: [
      'Form an "O" shape with your lips and tuck your upper lip over your top teeth.',
      'Smile with the corners of your mouth to elevate the cheek muscles.',
      'Hold for 5 seconds, repeat 5 cycles.',
      'Gently glide your fingers from the chin, along the jawline, up past the ears, and down the neck.'
    ]
  }
];

export default function FaceYogaPage() {
  const [isMirrorActive, setIsMirrorActive] = useState(false);
  const [activeExercise, setActiveExercise] = useState(FACE_EXERCISES[0]);
  const [completedId, setCompletedId] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMirror = async () => {
    if (isMirrorActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsMirrorActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsMirrorActive(true);
      } catch (err) {
        alert('Mirror webcam unavailable. You can still follow the illustrated guidance.');
      }
    }
  };

  const handleComplete = (ex) => {
    soundscapes.playSingingBowl(240);
    api.completeSession('Face Yoga', ex.duration).catch(() => {});
    setCompletedId(ex.id);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
            Facial Neuromuscular Relaxation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Face Yoga & TMJ Release
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Our faces carry unspoken stress in the jaw, eyes, and brow. These gentle exercises restore symmetry, reduce tension headaches, and stimulate natural glow.
          </p>
        </div>

        <button
          onClick={toggleMirror}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95 ${
            isMirrorActive
              ? 'bg-stone-800 text-white'
              : 'bg-sage-700 hover:bg-sage-800 text-white'
          }`}
        >
          {isMirrorActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          <span>{isMirrorActive ? 'Close Mirror Feed' : 'Open Practice Mirror'}</span>
        </button>
      </div>

      {/* Selfie Mirror Viewer if active */}
      {isMirrorActive && (
        <div className="zen-glass p-6 rounded-3xl border border-sage-300 subtle-shadow animate-fade-in flex flex-col items-center">
          <div className="relative w-full max-w-md h-64 md:h-72 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute top-3 left-3 bg-stone-900/70 text-white text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-sm">
              Live Self Mirror Feed
            </div>
          </div>
          <span className="text-[11px] text-stone-500 mt-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-sage-600" />
            Mirror feed runs completely on your local device.
          </span>
        </div>
      )}

      {/* Main Focus Detail Card */}
      <div className="zen-glass p-8 rounded-3xl border border-sage-200/90 subtle-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {activeExercise.tag} • {activeExercise.duration} mins
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              {activeExercise.title}
            </h3>
            <p className="text-xs text-stone-500">
              Target Muscle: <strong className="text-stone-700">{activeExercise.target}</strong>
            </p>
          </div>

          <button
            onClick={() => handleComplete(activeExercise)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
              completedId === activeExercise.id
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-sage-700 hover:bg-sage-800 text-white'
            }`}
          >
            {completedId === activeExercise.id ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Routine Completed & Logged</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Mark Practice Complete</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {activeExercise.description}
        </p>

        {/* Steps */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Step-by-Step Technique
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {activeExercise.steps.map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-sage-200/80 text-xs text-stone-800 flex items-start gap-3 shadow-xs"
              >
                <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-800 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Routine Directory Selector */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Targeted Facial Routines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FACE_EXERCISES.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                activeExercise.id === ex.id
                  ? 'bg-sage-100/90 border-sage-400 shadow-md scale-102'
                  : 'zen-glass border-sage-200 text-stone-700 hover:bg-sage-50'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {ex.duration} mins
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900 leading-snug">
                  {ex.title}
                </h4>
                <p className="text-[11px] text-stone-600 line-clamp-2">
                  {ex.description}
                </p>
              </div>

              <span className="text-xs font-semibold text-sage-800 pt-3 block">
                {activeExercise.id === ex.id ? 'Selected' : 'Practice This'} →
              </span>
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
