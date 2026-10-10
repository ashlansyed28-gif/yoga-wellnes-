import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Sparkles, 
  Camera, 
  Flame, 
  CheckCircle2, 
  X, 
  Pause, 
  RotateCcw,
  Volume2,
  Calendar,
  Filter
} from 'lucide-react';
import { api } from '../lib/api';
import { soundscapes } from '../lib/audioSynth';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const YOGA_CLASSES = [
  {
    id: 'yg-1',
    title: 'Morning Sun Vitality Vinyasa',
    category: 'Morning',
    level: 'Beginner',
    duration: 15,
    tag: 'Energizing',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
    description: 'Awaken your spine with classical Surya Namaskar A variations and gentle hamstring stretches.',
    poses: ['Mountain Pose (Tadasana)', 'Upward Salute (Urdhva Hastasana)', 'Gentle Cobra (Bhujangasana)', 'Downward Dog (Adho Mukha Svanasana)']
  },
  {
    id: 'yg-2',
    title: 'Spine & Lower Back Therapeutic Flow',
    category: 'Back & Neck',
    level: 'Beginner',
    duration: 12,
    tag: 'Pain Relief',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    description: 'Designed specifically to decompress lumbar vertebrae, release tight glutes, and soften the sacrum.',
    poses: ["Child's Pose (Balasana)", 'Cat-Cow Flow (Marjaryasana-Bitilasana)', 'Supine Figure Four', 'Gentle Spinal Twist']
  },
  {
    id: 'yg-3',
    title: 'Office Chair Decompression & Shoulder Melt',
    category: 'Office/Chair',
    level: 'All Levels',
    duration: 8,
    tag: 'Desk Friendly',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600',
    description: 'Practice directly from your office chair. Eases forward-head posture and wrist keyboard fatigue.',
    poses: ['Seated Cat-Cow', 'Chair Eagle Arms (Garudasana arms)', 'Seated Torso Twist', 'Wrist Extensor Releases']
  },
  {
    id: 'yg-4',
    title: 'Deep Hip & Hamstring Elasticity',
    category: 'Flexibility',
    level: 'Intermediate',
    duration: 20,
    tag: 'Flexibility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    description: 'Slow-held Yin poses targeting deep fascial tissue in the iliopsoas and hamstrings.',
    poses: ['Low Lunge (Anjaneyasana)', 'Half Monkey Pose (Ardha Hanumanasana)', 'Lizard Pose (Utthan Pristhasana)', 'Pigeon Pose (Eka Pada Rajakapotasana)']
  },
  {
    id: 'yg-5',
    title: 'Evening Candlelight Restorative Yin',
    category: 'Evening',
    level: 'Beginner',
    duration: 18,
    tag: 'Sleep Induction',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
    description: 'Supportive grounding postures using blankets or pillows to encourage restful parasympathetic surrender.',
    poses: ['Supported Bridge Pose', 'Reclined Butterfly (Supta Baddha Konasana)', 'Legs-up-the-Wall (Viparita Karani)', 'Savasana']
  },
  {
    id: 'yg-6',
    title: 'Core & Warrior Power Balance',
    category: 'Strength',
    level: 'Advanced',
    duration: 25,
    tag: 'Power & Stamina',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
    description: 'Dynamic sequencing focusing on isometric muscular endurance, arm balances, and steady warrior stances.',
    poses: ['Warrior II (Virabhadrasana II)', 'Side Plank (Vasisthasana)', 'Chair Pose (Utkatasana)', 'Crow Pose (Bakasana)']
  }
];

const CATEGORIES = ['All', 'Morning', 'Evening', 'Back & Neck', 'Office/Chair', 'Flexibility', 'Strength', 'Beginner'];

export default function YogaLibraryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const filteredClasses = selectedCategory === 'All'
    ? YOGA_CLASSES
    : YOGA_CLASSES.filter((c) => c.category === selectedCategory || c.level === selectedCategory);

  const startSessionModal = (cls) => {
    setActiveSession(cls);
    setSessionTimer(cls.duration * 60);
    setIsTimerRunning(true);
    setSessionFinished(false);
    soundscapes.playSingingBowl(216);
  };

  const closeSessionModal = () => {
    setActiveSession(null);
    setIsTimerRunning(false);
  };

  // Timer interval
  React.useEffect(() => {
    let interval = null;
    if (isTimerRunning && sessionTimer > 0) {
      interval = setInterval(() => {
        setSessionTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setSessionFinished(true);
            soundscapes.playSingingBowl(240);
            if (activeSession) {
              api.completeSession('Yoga', activeSession.duration).catch(() => {});
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, sessionTimer, activeSession]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
            Online VOD & Guided Asana Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Yoga Sanctuary Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Categorized practices for morning vitality, desk relief, deep mobility, and sleep.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yoga/pose-correction')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-md active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-sage-200" />
            <span>Launch AI Pose Feedback</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-stone-400 mr-1 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-sage-700 text-white shadow-sm'
                : 'bg-white/80 border border-sage-200 text-stone-700 hover:bg-sage-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Yoga Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="zen-glass rounded-3xl border border-sage-200/90 subtle-shadow hover:subtle-glow transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-stone-900 shadow-sm">
                  {cls.tag}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-900/70 text-white backdrop-blur-sm">
                  {cls.level}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold uppercase tracking-wider text-sage-700">
                    {cls.category}
                  </span>
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sage-600" />
                    <span>{cls.duration} mins</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-sage-800 transition-colors">
                  {cls.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {cls.description}
                </p>

                {/* Key Poses */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Key Asanas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.poses.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-sage-50 text-sage-800 border border-sage-200/60"
                      >
                        {p.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => startSessionModal(cls)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Begin Practice Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Practice Session Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 subtle-shadow border border-sage-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sage-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
                  Active Practice Session
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {activeSession.title}
                </h3>
              </div>
              <button
                onClick={closeSessionModal}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-sand-50 border border-sage-200/80 text-center">
              <span className="text-xs uppercase font-semibold text-stone-500 tracking-wider">
                {sessionFinished ? 'Practice Completed' : isTimerRunning ? 'Mindful Flow in Progress' : 'Paused'}
              </span>
              <span className="font-serif text-5xl md:text-6xl font-bold text-sage-900 my-2">
                {formatTimer(sessionTimer)}
              </span>
              <p className="text-xs text-stone-600 max-w-xs">
                {sessionFinished
                  ? 'Great practice! Your session and consistency streak have been logged.'
                  : 'Breathe smoothly with each posture. Honor your edge and never force joints.'}
              </p>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 mt-6">
                {!sessionFinished ? (
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-700 text-white font-semibold text-xs shadow-md"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isTimerRunning ? 'Pause Flow' : 'Resume Flow'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Session Recorded</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSessionTimer(activeSession.duration * 60);
                    setIsTimerRunning(false);
                    setSessionFinished(false);
                  }}
                  title="Reset Timer"
                  className="p-2.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Step-by-Step Sequence & Alignment
              </h4>
              <div className="space-y-2">
                {activeSession.poses.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-sage-50/70 border border-sage-200/60 flex items-center justify-between text-xs text-stone-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-900 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{p}</span>
                    </div>
                    <Link
                      to="/yoga/pose-correction"
                      className="text-[11px] font-semibold text-sage-700 hover:text-sage-900 flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Check AI Form</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Disclaimer */}
            <MedicalDisclaimer compact={true} />
          </div>
        </div>
      )}

      {/* Prominent Medical Notice */}
      <div className="pt-6">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
